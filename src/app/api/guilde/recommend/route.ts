import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildRecommendPrompt } from "@/lib/prompts";
import { getDemoRecommendation } from "@/lib/demo";
import type { TerrainProfile } from "@/types/terrain";
import type { GuildRecommendationResponse } from "@/types/guild";

interface RequestBody {
  terrain: TerrainProfile;
  superficie: number;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  const { terrain, superficie } = body;
  if (!terrain || typeof superficie !== "number") {
    return NextResponse.json(
      { error: "Les champs 'terrain' et 'superficie' sont requis." },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ...getDemoRecommendation(terrain, superficie), demo: true });
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      max_tokens: 1000,
      messages: [{ role: "user", content: buildRecommendPrompt(terrain, superficie) }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    const clean = text.replace(/```json\n?|```/g, "").trim();
    const parsed = JSON.parse(clean) as GuildRecommendationResponse;

    return NextResponse.json({ ...parsed, demo: false });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur inconnue lors de l'appel à l'API.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
