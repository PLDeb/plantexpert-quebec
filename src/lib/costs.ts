import type { GeneratedGuild } from "@/types/guild";
import type { Plant } from "@/types/plant";

// Coûts de main-d'œuvre indicatifs (design + plantation), à ajuster selon l'entreprise.
export const LABOR_PER_M2 = 8;
export const DESIGN_FEE = 350;

export function guildSubtotal(
  guild: GeneratedGuild | null,
  plantesDetails: Record<string, Plant>,
): number {
  if (!guild?.plantes) return 0;
  return guild.plantes.reduce((total, gp) => {
    const plant = plantesDetails[gp.nom];
    const qte = gp.quantite || 1;
    return total + (plant?.prix ? plant.prix * qte : 0);
  }, 0);
}

export interface CostEstimate {
  plantes: number;
  labor: number;
  design: number;
  sousTotal: number;
  min: number;
  max: number;
}

export function estimateCosts(
  guild: GeneratedGuild | null,
  superficie: number,
  plantesDetails: Record<string, Plant>,
): CostEstimate {
  const plantes = guildSubtotal(guild, plantesDetails);
  const labor = Math.round(LABOR_PER_M2 * (superficie || 500));
  const design = DESIGN_FEE;
  const sousTotal = plantes + labor + design;
  return {
    plantes,
    labor,
    design,
    sousTotal,
    min: Math.round(sousTotal * 0.85),
    max: Math.round(sousTotal * 1.25),
  };
}
