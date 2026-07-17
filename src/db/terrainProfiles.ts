import { getPrisma } from "./client";
import type { Prisma } from "@/generated/prisma/client";
import type { TerrainProfile } from "@/types/terrain";
import type { ParcoursId } from "@/lib/parcours";

export async function saveTerrainProfile(parcours: ParcoursId, data: TerrainProfile) {
  return getPrisma().terrainProfile.create({
    data: {
      parcours,
      region: data.localisation?.region || null,
      zoneRusticite: data.localisation?.zone_rusticite || null,
      superficieM2: data.terrain?.superficie_m2 || null,
      data: data as unknown as Prisma.InputJsonValue,
    },
  });
}
