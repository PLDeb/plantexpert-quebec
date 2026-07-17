import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildGuildPrompt } from "@/lib/prompts";
import { getDemoGuild } from "@/lib/demo";
import { templateById } from "@/lib/guilds";
import type { TerrainProfile } from "@/types/terrain";
import type { GeneratedGuild } from "@/types/guild";

interface RequestBody {
  terrain: TerrainProfile;
  superficie: number;
  templateId?: string;
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ guild: getDemoGuild(template, terrain, superficie), demo: true });
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: buildGuildPrompt(terrain, superficie, template) }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    const clean = text.replace(/```json\n?|```/g, "").trim();
    const guild = JSON.parse(clean) as GeneratedGuild;

    return NextResponse.json({ guild, demo: false });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur inconnue lors de l'appel à l'API.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
