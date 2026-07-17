import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/db/leads";

interface RequestBody {
  email: string;
  prenom?: string;
  parcours?: string;
  terrainProfileId?: string;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  const { email, prenom, parcours, terrainProfileId } = body;
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Un courriel valide est requis." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ id: null, persisted: false });
  }

  try {
    const record = await saveLead({ email, prenom, parcours, terrainProfileId });
    return NextResponse.json({ id: record.id, persisted: true });
  } catch (err) {
    console.error("Erreur sauvegarde lead:", err);
    return NextResponse.json({ id: null, persisted: false });
  }
}
