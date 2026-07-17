import { plantByName } from "./plants";
import type { GeneratedGuild } from "@/types/guild";

// Coûts de main-d'œuvre indicatifs (design + plantation), à ajuster selon l'entreprise.
export const LABOR_PER_M2 = 8;
export const DESIGN_FEE = 350;

export function guildSubtotal(guild: GeneratedGuild | null): number {
  if (!guild?.plantes) return 0;
  return guild.plantes.reduce((total, gp) => {
    const plant = plantByName(gp.nom);
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

export function estimateCosts(guild: GeneratedGuild | null, superficie: number): CostEstimate {
  const plantes = guildSubtotal(guild);
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
