import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildGuildPrompt } from "@/lib/prompts";
import { getDemoGuild } from "@/lib/demo";
import { templateById } from "@/lib/guilds";
import { plantByName } from "@/lib/plants";
import { plantSummaryForZoneDb, planteByNameDb } from "@/db/plants";
import type { TerrainProfile } from "@/types/terrain";
import type { GeneratedGuild } from "@/types/guild";
import type { Plant } from "@/types/plant";

interface RequestBody {
  terrain: TerrainProfile;
  superficie: number;
  templateId?: string;
}

/** Construit le dictionnaire nom -> fiche complète pour chaque plante de la guilde,
 * afin que les composants client (sans accès DB) puissent afficher leurs détails. */
async function buildPlantesDetails(
  guild: GeneratedGuild,
  demo: boolean,
): Promise<Record<string, Plant>> {
  const details: Record<string, Plant> = {};
  for (const gp of guild.plantes ?? []) {
    const plant = demo ? plantByName(gp.nom) : await planteByNameDb(gp.nom);
    if (plant) details[gp.nom] = plant;
  }
  // Filet de sécurité : si l'IA a choisi une espèce absente du catalogue DB
  // (nom légèrement différent), on retente sur le catalogue statique.
  if (!demo) {
    for (const gp of guild.plantes ?? []) {
      if (!details[gp.nom]) {
        const fallback = plantByName(gp.nom);
        if (fallback) details[gp.nom] = fallback;
      }
    }
  }
  return details;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  const { terrain, superficie, templateId } = body;
  if (!terrain || typeof superficie !== "number") {
    return NextResponse.json(
      { error: "Les champs 'terrain' et 'superficie' sont requis." },
      { status: 400 },
    );
  }

  const template = templateId ? templateById(templateId) : null;
  const clientZone = terrain?.localisation?.zone_rusticite ?? "3";

  if (!process.env.ANTHROPIC_API_KEY) {
    const guild = getDemoGuild(template, terrain, superficie);
    const plantesDetails = await buildPlantesDetails(guild, true);
    return NextResponse.json({ guild, plantesDetails, demo: true });
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const plantList = await plantSummaryForZoneDb(clientZone);

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: buildGuildPrompt(terrain, superficie, plantList, template) }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    const clean = text.replace(/```json\n?|```/g, "").trim();
    const guild = JSON.parse(clean) as GeneratedGuild;
    const plantesDetails = await buildPlantesDetails(guild, false);

    return NextResponse.json({ guild, plantesDetails, demo: false });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur inconnue lors de l'appel à l'API.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
