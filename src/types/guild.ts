import type { RoleGuilde } from "./plant";

export type GuildAxe = "arbre-central" | "objectif" | "milieu";

export interface GuildTemplate {
  id: string;
  nom: string;
  axe: GuildAxe;
  emoji: string;
  zoneMin: number;
  objectifs: string[];
  milieux: string[];
  desc: string;
  roles: RoleGuilde[];
  couleur: string;
}

export interface GeneratedGuildPlant {
  nom: string;
  quantite: number;
  orientation: string;
  distance: number;
  role_dans_guilde: string;
  priorite: "obligatoire" | "recommandé" | "optionnel" | string;
}

/** Guilde générée par l'IA (ou le mode démo) à partir d'un GuildTemplate + du terrain. */
export interface GeneratedGuild {
  nom: string;
  description: string;
  milieu_analyse: string;
  plantes: GeneratedGuildPlant[];
  logique_spatiale: string;
  sequence_plantation: string;
  synergies_cles: string[];
  points_attention: string[];
}

export interface GuildRecommendation {
  template_id: string;
  raison: string;
  superficie_allouee_m2: number;
}

export interface GuildRecommendationResponse {
  recommandations: GuildRecommendation[];
  logique_ensemble: string;
}
