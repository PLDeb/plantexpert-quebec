import { NextRequest, NextResponse } from "next/server";
import { saveTerrainProfile } from "@/db/terrainProfiles";
import type { TerrainProfile } from "@/types/terrain";
import type { ParcoursId } from "@/lib/parcours";

interface RequestBody {
  parcours: ParcoursId;
  terrain: TerrainProfile;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  const { parcours, terrain } = body;
  if (!parcours || !terrain) {
    return NextResponse.json(
      { error: "Les champs 'parcours' et 'terrain' sont requis." },
      { status: 400 },
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ id: null, persisted: false });
  }

  try {
    const record = await saveTerrainProfile(parcours, terrain);
    return NextResponse.json({ id: record.id, persisted: true });
  } catch (err) {
    console.error("Erreur sauvegarde terrain_profile:", err);
    return NextResponse.json({ id: null, persisted: false });
  }
}
