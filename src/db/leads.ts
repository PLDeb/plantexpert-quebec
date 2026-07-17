import { getPrisma } from "./client";

export interface SaveLeadInput {
  email: string;
  prenom?: string;
  parcours?: string;
  terrainProfileId?: string;
}

export async function saveLead(input: SaveLeadInput) {
  return getPrisma().lead.create({
    data: {
      email: input.email,
      prenom: input.prenom || null,
      parcours: input.parcours || null,
      terrainProfileId: input.terrainProfileId || null,
    },
  });
}
