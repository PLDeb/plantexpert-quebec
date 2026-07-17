import type { Plant, StrateInfo } from "@/types/plant";

// Base de plantes. Objectif produit : faire grandir cette liste à 100+ espèces
// (voir BRIEF section 6 pour les sources de données à privilégier).
export const PLANTS: Plant[] = [
  { id: 1, prix: 55, nom: "Pommier", latin: "Malus domestica", emoji: "🍎", zoneMin: 3, zone: "3", indigene: false, forme: "Arbre", hauteur: [3, 5], espacement: 5, sol: ["moyen", "lourd"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Comestible", "Nourriture faune", "Pollinisateurs"], strate: "sous-canopee", roleGuilde: "arbre-central", orientation_preferee: "S", couleur: "#C0392B", ecologie: "Arbre fruitier central classique des guildes de permaculture. Nécessite un pollinisateur compatible à proximité. Excellente structure d'accueil pour un sous-étage productif." },
  { id: 2, prix: 58, nom: "Poirier", latin: "Pyrus communis", emoji: "🍐", zoneMin: 4, zone: "4", indigene: false, forme: "Arbre", hauteur: [4, 6], espacement: 5, sol: ["moyen", "lourd"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Comestible", "Nourriture faune", "Pollinisateurs"], strate: "sous-canopee", roleGuilde: "arbre-central", orientation_preferee: "S", couleur: "#B5A642", ecologie: "Fruitier robuste et longévif. Plus tolérant aux sols lourds que le pommier. Floraison précoce, bon pour les pollinisateurs." },
  { id: 3, prix: 52, nom: "Prunier", latin: "Prunus domestica", emoji: "🟣", zoneMin: 4, zone: "4", indigene: false, forme: "Arbre", hauteur: [3, 5], espacement: 4, sol: ["moyen"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Comestible", "Nourriture faune", "Pollinisateurs"], strate: "sous-canopee", roleGuilde: "arbre-central", orientation_preferee: "S", couleur: "#6B3A5A", ecologie: "Fruitier productif à floraison hâtive. Attire abondamment les pollinisateurs au printemps. Certaines variétés autofertiles." },
  { id: 4, prix: 48, nom: "Cerisier", latin: "Prunus cerasus", emoji: "🍒", zoneMin: 3, zone: "3", indigene: false, forme: "Arbre", hauteur: [3, 5], espacement: 4, sol: ["léger", "moyen"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Comestible", "Nourriture faune", "Pollinisateurs", "Ornemental"], strate: "sous-canopee", roleGuilde: "arbre-central", orientation_preferee: "S", couleur: "#D4526E", ecologie: "Cerisier acidulé rustique (griotte). Résistant au froid, floraison ornementale spectaculaire. Fruits appréciés des oiseaux." },
  { id: 5, prix: 42, nom: "Argousier", latin: "Hippophae rhamnoides", emoji: "🧡", zoneMin: 2, zone: "2", indigene: false, forme: "Arbuste", hauteur: [2, 4], espacement: 2.5, sol: ["léger", "moyen"], lumiere: "plein-soleil", eau: "peu", fonctions: ["Comestible", "Fixateur d'azote", "Brise-vent"], strate: "arbustive-haute", roleGuilde: "fixateur-azote", orientation_preferee: "S-O", couleur: "#E67E22", ecologie: "Rare fruitier fixateur d'azote ! Baies très riches en vitamine C. Extrêmement rustique et tolérant à la sécheresse. Plantes mâles et femelles nécessaires." },
  { id: 6, prix: 18, nom: "Camérisier bleu", latin: "Lonicera caerulea", emoji: "🫐", zoneMin: 2, zone: "2", indigene: true, forme: "Arbuste", hauteur: [1, 2], espacement: 2, sol: ["léger", "moyen", "lourd"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Comestible", "Nourriture faune", "Pollinisateurs"], strate: "arbustive-basse", roleGuilde: "petit-fruit", orientation_preferee: "S-E", couleur: "#4A90A4", ecologie: "Floraison très précoce (avril), essentielle pour les pollinisateurs au sortir de l'hiver. Très rustique." },
  { id: 7, prix: 35, nom: "Amélanchier du Canada", latin: "Amelanchier canadensis", emoji: "🌸", zoneMin: 3, zone: "3", indigene: true, forme: "Arbre", hauteur: [4, 6], espacement: 4, sol: ["léger", "moyen", "lourd"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Comestible", "Nourriture faune", "Ornemental", "Bande riveraine"], strate: "sous-canopee", roleGuilde: "petit-fruit", orientation_preferee: "S-E", couleur: "#E8A87C", ecologie: "Première à fleurir au printemps. Fruits (petites poires) très appréciés des oiseaux et des humains. Indigène adaptable." },
  { id: 8, prix: 16, nom: "Aronie noire", latin: "Aronia melanocarpa", emoji: "🫒", zoneMin: 3, zone: "3", indigene: true, forme: "Arbuste", hauteur: [1, 1.5], espacement: 1.5, sol: ["léger", "moyen", "lourd"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Comestible", "Nourriture faune", "Couvre-sol"], strate: "arbustive-basse", roleGuilde: "petit-fruit", orientation_preferee: "S", couleur: "#6B3A5A", ecologie: "Indigène supportant les sols pauvres. Baies très riches en antioxydants. Excellent sur les pentes." },
  { id: 9, prix: 8, nom: "Framboisier", latin: "Rubus idaeus", emoji: "🍓", zoneMin: 2, zone: "2", indigene: true, forme: "Arbuste", hauteur: [1, 2], espacement: 1, sol: ["léger", "moyen"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Comestible", "Nourriture faune", "Couvre-sol"], strate: "arbustive-basse", roleGuilde: "petit-fruit", orientation_preferee: "S-E", couleur: "#D4526E", ecologie: "Espèce pionnière indigène. Les tiges mortes abritent les insectes solitaires. Feuilles médicinales." },
  { id: 10, prix: 20, nom: "Sureau du Canada", latin: "Sambucus canadensis", emoji: "🍇", zoneMin: 3, zone: "3", indigene: true, forme: "Arbuste", hauteur: [2, 4], espacement: 3, sol: ["moyen", "lourd"], lumiere: "plein-soleil", eau: "beaucoup", fonctions: ["Comestible", "Nourriture faune", "Médicinal", "Pollinisateurs"], strate: "arbustive-haute", roleGuilde: "petit-fruit", orientation_preferee: "N-E", couleur: "#8E44AD", ecologie: "Indigène très productif en milieux humides. Fleurs et fruits comestibles et médicinaux. Aimant à oiseaux." },
  { id: 11, prix: 12, nom: "Aulne rugueux", latin: "Alnus incana", emoji: "🌿", zoneMin: 2, zone: "2b", indigene: true, forme: "Arbre", hauteur: [8, 15], espacement: 5, sol: ["moyen", "lourd"], lumiere: "plein-soleil", eau: "beaucoup", fonctions: ["Fixateur d'azote", "Brise-vent", "Bande riveraine", "Abri faune"], strate: "canopee-basse", roleGuilde: "fixateur-azote", orientation_preferee: "N-O", couleur: "#7BA05B", ecologie: "Fixateur d'azote symbiotique indigène. Colonise les sols pauvres et humides. Parfait en bande riveraine ou brise-vent." },
  { id: 12, prix: 14, nom: "Faux indigo", latin: "Amorpha fruticosa", emoji: "💜", zoneMin: 4, zone: "3b", indigene: false, forme: "Arbuste", hauteur: [2, 3], espacement: 2, sol: ["léger", "moyen", "lourd"], lumiere: "plein-soleil", eau: "peu", fonctions: ["Fixateur d'azote", "Pollinisateurs", "Bande riveraine"], strate: "arbustive-haute", roleGuilde: "fixateur-azote", orientation_preferee: "S-O", couleur: "#5B4A8B", ecologie: "Fixateur d'azote tolérant à la sécheresse. Fleurs violet très mellifères." },
  { id: 13, prix: 16, nom: "Myrique baumier", latin: "Myrica gale", emoji: "🌾", zoneMin: 2, zone: "2", indigene: true, forme: "Arbuste", hauteur: [0.5, 1.5], espacement: 1.5, sol: ["moyen", "lourd"], lumiere: "plein-soleil", eau: "beaucoup", fonctions: ["Fixateur d'azote", "Bande riveraine", "Médicinal"], strate: "arbustive-basse", roleGuilde: "fixateur-azote", orientation_preferee: "N-E", couleur: "#5D8A66", ecologie: "Petit arbuste indigène fixateur d'azote des milieux humides. Feuillage aromatique. Idéal en bordure de zone mouillée." },
  { id: 14, prix: 45, nom: "Érable à sucre", latin: "Acer saccharum", emoji: "🍁", zoneMin: 4, zone: "3b", indigene: true, forme: "Arbre", hauteur: [15, 20], espacement: 10, sol: ["moyen"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Acéricole", "Abri faune", "Coupe-vent"], strate: "canopee-haute", roleGuilde: "canopee", orientation_preferee: "N", couleur: "#C0392B", ecologie: "Espèce dominante de la forêt décidue québécoise. Canopée riche, biodiversité élevée. Acériculture." },
  { id: 15, prix: 25, nom: "Peuplier faux-tremble", latin: "Populus tremuloides", emoji: "🌳", zoneMin: 1, zone: "1", indigene: true, forme: "Arbre", hauteur: [10, 20], espacement: 6, sol: ["léger", "moyen"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Abri faune", "Brise-vent", "Coupe-vent"], strate: "canopee-haute", roleGuilde: "canopee", orientation_preferee: "N-O", couleur: "#BDC3C7", ecologie: "Espèce pionnière indigène très rapide. Crée un microclimat protecteur rapidement." },
  { id: 16, prix: 3, nom: "Consoude", latin: "Symphytum officinale", emoji: "🌿", zoneMin: 3, zone: "3", indigene: false, forme: "Herbacée", hauteur: [0.6, 1.2], espacement: 0.6, sol: ["moyen", "lourd"], lumiere: "mi-ombre", eau: "moyen", fonctions: ["Accumulateur de nutriments", "Pollinisateurs", "Médicinal"], strate: "couvre-sol", roleGuilde: "accumulateur", orientation_preferee: "S", couleur: "#8E44AD", ecologie: "Accumulateur de nutriments par excellence. Racine pivotante profonde qui remonte le potassium. Feuilles utilisées comme engrais vert (paillis)." },
  { id: 17, prix: 3, nom: "Pissenlit", latin: "Taraxacum officinale", emoji: "🌼", zoneMin: 1, zone: "1", indigene: false, forme: "Herbacée", hauteur: [0.1, 0.4], espacement: 0.3, sol: ["léger", "moyen", "lourd"], lumiere: "plein-soleil", eau: "peu", fonctions: ["Accumulateur de nutriments", "Pollinisateurs", "Comestible", "Médicinal"], strate: "couvre-sol", roleGuilde: "accumulateur", orientation_preferee: "S", couleur: "#F39C12", ecologie: "Accumulateur de nutriments via sa racine pivotante. Première source de pollen printanier." },
  { id: 18, prix: 10, nom: "Raisin d'ours", latin: "Arctostaphylos uva-ursi", emoji: "🔴", zoneMin: 2, zone: "2", indigene: true, forme: "Arbuste", hauteur: [0.1, 0.2], espacement: 1, sol: ["léger"], lumiere: "plein-soleil", eau: "peu", fonctions: ["Couvre-sol", "Nourriture faune", "Médicinal"], strate: "couvre-sol", roleGuilde: "couvre-sol", orientation_preferee: "S", couleur: "#922B21", ecologie: "Couvre-sol persistant indigène pour sols légers acides et sites secs. Contrôle l'érosion sur pente sèche." },
  { id: 19, prix: 6, nom: "Fraisier des champs", latin: "Fragaria virginiana", emoji: "🍓", zoneMin: 2, zone: "2", indigene: true, forme: "Herbacée", hauteur: [0.1, 0.2], espacement: 0.3, sol: ["léger", "moyen"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Comestible", "Couvre-sol", "Nourriture faune", "Pollinisateurs"], strate: "couvre-sol", roleGuilde: "couvre-sol", orientation_preferee: "S", couleur: "#E74C3C", ecologie: "Fraise sauvage indigène, couvre-sol comestible parfait sous les fruitiers. Stolons colonisateurs, petits fruits savoureux." },
  { id: 20, prix: 8, nom: "Monarde fistuleuse", latin: "Monarda fistulosa", emoji: "🌸", zoneMin: 3, zone: "3", indigene: true, forme: "Herbacée", hauteur: [0.6, 1.2], espacement: 0.4, sol: ["léger", "moyen"], lumiere: "plein-soleil", eau: "moyen", fonctions: ["Pollinisateurs", "Médicinal", "Ornemental"], strate: "couvre-sol", roleGuilde: "pollinisateur", orientation_preferee: "S", couleur: "#9B59B6", ecologie: "Indigène aimant à pollinisateurs et papillons. Feuillage aromatique médicinal (thé). Fleurs mauves spectaculaires." },
  { id: 21, prix: 15, nom: "Cornouiller stolonifère", latin: "Cornus sericea", emoji: "🌾", zoneMin: 2, zone: "2", indigene: true, forme: "Arbuste", hauteur: [1.5, 3], espacement: 2, sol: ["moyen", "lourd"], lumiere: "plein-soleil", eau: "beaucoup", fonctions: ["Bande riveraine", "Nourriture faune", "Ornemental"], strate: "arbustive-haute", roleGuilde: "riveraine", orientation_preferee: "N-E", couleur: "#E74C3C", ecologie: "Excellente espèce riveraine indigène. Tiges rouges ornementales en hiver. Stabilisation des berges." },
];

export const FN_COLORS: Record<string, string> = {
  "Fixateur d'azote": "#27AE60",
  "Accumulateur de nutriments": "#8E44AD",
  "Comestible": "#E67E22",
  "Nourriture faune": "#2980B9",
  "Pollinisateurs": "#F39C12",
  "Brise-vent": "#95A5A6",
  "Bande riveraine": "#1ABC9C",
  "Couvre-sol": "#7F8C8D",
  "Ornemental": "#E91E63",
  "Médicinal": "#9B59B6",
  "Abri faune": "#3498DB",
  "Acéricole": "#D35400",
  "Coupe-vent": "#BDC3C7",
};

export const STRATES: StrateInfo[] = [
  { id: "canopee-haute", label: "Canopée haute", h: "10–25m", c: "#1A3A2A" },
  { id: "canopee-basse", label: "Canopée basse", h: "5–10m", c: "#2D5A3D" },
  { id: "sous-canopee", label: "Sous-canopée", h: "3–6m", c: "#4A7A5A" },
  { id: "arbustive-haute", label: "Arbustive haute", h: "2–4m", c: "#6B9E7A" },
  { id: "arbustive-basse", label: "Arbustive basse", h: "0.5–2m", c: "#8B6B4A" },
  { id: "couvre-sol", label: "Couvre-sol", h: "0–0.5m", c: "#B5C9BB" },
];

/** Convertit une chaîne de zone ("3b", "4", "3d") en nombre pour comparaison. */
export function zoneToNumber(zoneStr?: string | null): number {
  if (!zoneStr) return 3;
  const match = String(zoneStr).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 3;
}

/** Filtre les plantes selon la zone du client (zoneMin de la plante <= zone client). */
export function plantsForZone(clientZone?: string | null): Plant[] {
  const z = zoneToNumber(clientZone);
  return PLANTS.filter((p) => p.zoneMin <= z);
}

export function plantByName(name: string): Plant | null {
  return PLANTS.find((p) => p.nom === name) ?? null;
}

export interface PlantSummary {
  nom: string;
  strate: Plant["strate"];
  role: Plant["roleGuilde"];
  fonctions: string[];
  sol: string[];
  lumiere: Plant["lumiere"];
  eau: Plant["eau"];
  zoneMin: number;
  indigene: boolean;
  hauteur: [number, number];
  espacement: number;
  orientation_preferee: string;
}

/** Résumé allégé des plantes disponibles pour une zone, pensé pour être envoyé à l'IA. */
export function plantSummaryForZone(clientZone?: string | null): PlantSummary[] {
  return plantsForZone(clientZone).map((p) => ({
    nom: p.nom,
    strate: p.strate,
    role: p.roleGuilde,
    fonctions: p.fonctions,
    sol: p.sol,
    lumiere: p.lumiere,
    eau: p.eau,
    zoneMin: p.zoneMin,
    indigene: p.indigene,
    hauteur: p.hauteur,
    espacement: p.espacement,
    orientation_preferee: p.orientation_preferee,
  }));
}
