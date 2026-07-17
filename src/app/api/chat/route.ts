import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { systemForParcours } from "@/lib/prompts";
import { getDemoReply } from "@/lib/demo";
import type { ParcoursId } from "@/lib/parcours";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: IncomingMessage[];
  parcours: ParcoursId;
}

const VALID_PARCOURS: ParcoursId[] = ["debutant", "intermediaire", "expert"];

export async function POST(req: NextRequest) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  const { messages, parcours } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Le champ 'messages' est requis." }, { status: 400 });
  }

  const parcoursId: ParcoursId = VALID_PARCOURS.includes(parcours) ? parcours : "debutant";

  // Mode démo : pas de clé API configurée, on simule Sylvie pour garder l'app testable.
  if (!process.env.ANTHROPIC_API_KEY) {
    const turnIndex = messages.filter((m) => m.role === "assistant").length;
    return NextResponse.json({ text: getDemoReply(turnIndex, parcoursId), demo: true });
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      max_tokens: 1000,
      system: systemForParcours(parcoursId),
      messages,
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    if (!text) {
      return NextResponse.json({ error: "Réponse vide de l'API." }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue lors de l'appel à l'API.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
