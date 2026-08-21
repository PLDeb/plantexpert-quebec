import { getPrisma } from "./client";
import { zoneToNumber } from "@/lib/plants";
import type { Plante as PlanteRow } from "@/generated/prisma/client";
import type { Plant, Forme, Lumiere, Eau, Strate, RoleGuilde } from "@/types/plant";
import type { PlantSummary } from "@/lib/plants";

// Traduit une ligne brute de la table `plantes` (fidèle au sheet source) vers
// le format `Plant` utilisé par le reste de l'app. Les champs propres à l'app
// (rôle de guilde, strate, prix, emoji, couleur, orientation) n'existent pas
// en base : ils sont déduits ici à la volée, pour rester faciles à corriger
// sans avoir à réimporter les données à chaque ajustement de logique.

const FORME_MAP: Record<string, Forme> = {
  "arbre": "Arbre",
  "arbuste": "Arbuste",
  "herbacée": "Herbacée",
  "grimpante": "Herbacée",
  "herbacée grimpante": "Herbacée",
};

const LUMIERE_PRIORITY: Lumiere[] = ["plein-soleil", "mi-ombre", "ombre"];
const LUMIERE_MAP: Record<string, Lumiere> = {
  "plein soleil": "plein-soleil",
  "mi-ombre": "mi-ombre",
  "ombre": "ombre",
};

const EAU_PRIORITY: Eau[] = ["moyen", "peu", "beaucoup"];
const EAU_MAP: Record<string, Eau> = { peu: "peu", moyen: "moyen", beaucoup: "beaucoup" };

const COULEUR_HEX: Record<string, string> = {
  "rouge": "#C0392B",
  "rose": "#E91E63",
  "blanc": "#ECF0F1",
  "jaune": "#F39C12",
  "orangé": "#E67E22",
  "pourpre": "#8E44AD",
  "verte": "#27AE60",
  "brun": "#8B6B4A",
  "bleu": "#2980B9",
};

const COULEUR_PAR_ROLE: Record<RoleGuilde, string> = {
  "fixateur-azote": "#7BA05B",
  "arbre-central": "#C0392B",
  "canopee": "#BDC3C7",
  "petit-fruit": "#8E3A5A",
  "accumulateur": "#8E44AD",
  "couvre-sol": "#6B9E7A",
  "pollinisateur": "#F39C12",
  "riveraine": "#4A7A5A",
};

const EMOJI_PAR_FORME: Record<Forme, string> = {
  Arbre: "🌳",
  Arbuste: "🌿",
  Herbacée: "🌱",
};

const PRIX_PAR_FORME: Record<Forme, number> = {
  Arbre: 45,
  Arbuste: 18,
  Herbacée: 6,
};

function toNumber(d: unknown): number | null {
  if (d === null || d === undefined) return null;
  if (typeof d === "number") return d;
  const maybeDecimal = d as { toNumber?: () => number };
  return typeof maybeDecimal.toNumber === "function" ? maybeDecimal.toNumber() : Number(d);
}

function pickPrimary<T extends string>(values: string[], map: Record<string, T>, priority: T[]): T | null {
  const mapped = values.map((v) => map[v]).filter((v): v is T => Boolean(v));
  for (const p of priority) {
    if (mapped.includes(p)) return p;
  }
  return mapped[0] ?? null;
}

function strateOf(forme: Forme, hauteurMax: number | null): Strate {
  if (forme === "Arbre") {
    const h = hauteurMax ?? 8;
    if (h >= 15) return "canopee-haute";
    if (h >= 8) return "canopee-basse";
    return "sous-canopee";
  }
  if (forme === "Arbuste") {
    const h = hauteurMax ?? 1.5;
    return h >= 2 ? "arbustive-haute" : "arbustive-basse";
  }
  return "couvre-sol";
}

function roleOf(p: PlanteRow, forme: Forme, strate: Strate, hauteurMax: number | null): RoleGuilde {
  if (p.fixateurAzote) return "fixateur-azote";
  const comestible = p.comestible.map((c) => c.toLowerCase());
  if (forme === "Arbre") {
    if (comestible.includes("fruit") && (hauteurMax ?? 0) < 12) return "arbre-central";
    return "canopee";
  }
  if (forme === "Arbuste" && comestible.includes("fruit")) return "petit-fruit";
  const eco = p.utilisationEcologique.map((e) => e.toLowerCase());
  if (eco.includes("bande riveraine") || eco.includes("zone inondable")) return "riveraine";
  if (p.accumulateurNutriments) return "accumulateur";
  if (p.couvreSol) return "couvre-sol";
  if (p.pollinisateurs.length > 0) return "pollinisateur";
  return strate === "couvre-sol" ? "couvre-sol" : "petit-fruit";
}

function orientationOf(lumiere: Lumiere | null, role: RoleGuilde): string {
  if (role === "riveraine") return "N-E";
  if (lumiere === "plein-soleil") return "S";
  if (lumiere === "mi-ombre") return "S-E";
  return "N";
}

function couleurOf(p: PlanteRow, role: RoleGuilde): string {
  const primary = p.couleurFloraison[0]?.toLowerCase();
  return (primary && COULEUR_HEX[primary]) || COULEUR_PAR_ROLE[role];
}

function fonctionsOf(p: PlanteRow): string[] {
  const fonctions: string[] = [];
  if (p.fixateurAzote) fonctions.push("Fixateur d'azote");
  if (p.accumulateurNutriments) fonctions.push("Accumulateur de nutriments");
  if (p.comestible.length > 0) fonctions.push("Comestible");
  if (p.medicinal) fonctions.push("Médicinal");
  if (p.couvreSol) fonctions.push("Couvre-sol");
  const eco = p.utilisationEcologique.map((e) => e.toLowerCase());
  if (eco.includes("bande riveraine") || eco.includes("zone inondable")) fonctions.push("Bande riveraine");
  if (p.vieSauvage.includes("nourriture")) fonctions.push("Nourriture faune");
  if (p.vieSauvage.includes("abri")) fonctions.push("Abri faune");
  if (p.pollinisateurs.length > 0) fonctions.push("Pollinisateurs");
  if (p.haie) fonctions.push("Brise-vent");
  return fonctions.length > 0 ? fonctions : ["Ornemental"];
}

function ecologieOf(p: PlanteRow, forme: Forme, role: RoleGuilde): string {
  const parts: string[] = [];
  const formeTxt = forme === "Arbre" ? "arbre" : forme === "Arbuste" ? "arbuste" : "plante herbacée";
  parts.push(p.fixateurAzote ? `Fixateur d'azote (${formeTxt})` : formeTxt.charAt(0).toUpperCase() + formeTxt.slice(1));
  if (p.comestible.length > 0) parts.push(`dont les ${p.comestible.join(", ")} sont comestibles`);
  if (p.medicinal) parts.push("usage médicinal reconnu");
  if (role === "riveraine") parts.push("adapté aux sols humides et bandes riveraines");
  if (p.vieSauvage.length > 0) parts.push(`offre ${p.vieSauvage.join(" et ")} à la faune`);
  if (p.pollinisateurs.includes("spécialistes")) parts.push("attire des pollinisateurs spécialistes");
  else if (p.pollinisateurs.includes("généralistes")) parts.push("attire une large diversité de pollinisateurs");
  let sentence = parts.join(". ") + ".";
  if (p.notes) sentence += ` ${p.notes}`;
  return sentence;
}

export function enrichPlante(p: PlanteRow): Plant {
  const forme = FORME_MAP[p.forme ?? ""] ?? "Arbuste";
  const hauteurMin = toNumber(p.hauteurMinM) ?? 1;
  const hauteurMax = toNumber(p.hauteurMaxM) ?? hauteurMin;
  const largeurMax = toNumber(p.largeurMaxM);
  const lumiere = pickPrimary(p.lumiere, LUMIERE_MAP, LUMIERE_PRIORITY) ?? "plein-soleil";
  const eau = pickPrimary(p.eau, EAU_MAP, EAU_PRIORITY) ?? "moyen";
  const sol = p.textureSol.length > 0 ? p.textureSol : ["moyen"];
  const strate = strateOf(forme, hauteurMax);
  const role = roleOf(p, forme, strate, hauteurMax);
  const zone = p.zoneRusticite ?? "4";

  return {
    id: Number(p.id),
    prix: PRIX_PAR_FORME[forme],
    nom: p.nomFrancais || `${p.genre} ${p.espece ?? ""}`.trim(),
    latin: `${p.genre} ${p.espece ?? ""}`.trim(),
    emoji: EMOJI_PAR_FORME[forme],
    zoneMin: zoneToNumber(zone),
    zone,
    indigene: p.indigene ?? false,
    forme,
    hauteur: [hauteurMin, hauteurMax],
    espacement: largeurMax ?? hauteurMax,
    sol,
    lumiere,
    eau,
    fonctions: fonctionsOf(p),
    strate,
    roleGuilde: role,
    orientation_preferee: orientationOf(lumiere, role),
    couleur: couleurOf(p, role),
    ecologie: ecologieOf(p, forme, role),
  };
}

let cache: Plant[] | null = null;

/** Catalogue complet, enrichi, mis en cache en mémoire pour la durée du process. */
export async function getAllPlantesEnrichies(): Promise<Plant[]> {
  if (cache) return cache;
  const rows = await getPrisma().plante.findMany({ orderBy: { id: "asc" } });
  cache = rows.map(enrichPlante);
  return cache;
}

/** Filtre les plantes selon la zone du client (zoneMin de la plante <= zone client). */
export async function plantesForZoneDb(clientZone?: string | null): Promise<Plant[]> {
  const z = zoneToNumber(clientZone);
  const all = await getAllPlantesEnrichies();
  return all.filter((p) => p.zoneMin <= z);
}

export async function planteByNameDb(nom: string): Promise<Plant | null> {
  const all = await getAllPlantesEnrichies();
  return all.find((p) => p.nom === nom) ?? null;
}

/** Résumé allégé des plantes disponibles pour une zone, pensé pour être envoyé à l'IA. */
export async function plantSummaryForZoneDb(clientZone?: string | null): Promise<PlantSummary[]> {
  const plants = await plantesForZoneDb(clientZone);
  return plants.map((p) => ({
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
