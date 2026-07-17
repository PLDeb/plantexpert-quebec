import type { GuildTemplate } from "@/types/guild";
import { zoneToNumber } from "./plants";

// Guildes-modèles : recettes éprouvées que l'IA adapte au terrain réel plutôt
// que de générer une guilde à 100% par IA (voir BRIEF section 4).
export const GUILD_TEMPLATES: GuildTemplate[] = [
  {
    id: "guilde-pommier",
    nom: "Guilde du pommier",
    axe: "arbre-central",
    emoji: "🍎",
    zoneMin: 3,
    objectifs: ["Comestible", "Production fruitière"],
    milieux: ["sol moyen", "plein soleil"],
    desc: "Un pommier ou poirier central entouré de plantes qui le nourrissent, attirent ses pollinisateurs et repoussent ses ravageurs. La guilde fruitière classique de permaculture.",
    roles: ["arbre-central", "fixateur-azote", "accumulateur", "pollinisateur", "couvre-sol"],
    couleur: "#C0392B",
  },
  {
    id: "haie-brise-vent",
    nom: "Haie brise-vent nourricière",
    axe: "objectif",
    emoji: "🌬️",
    zoneMin: 2,
    objectifs: ["Brise-vent", "Nourriture faune", "Biodiversité"],
    milieux: ["sites exposés", "bordure"],
    desc: "Une haie étagée qui coupe le vent tout en produisant fruits et abris pour la faune. Combine grands arbustes robustes et fixateurs d'azote.",
    roles: ["canopee", "fixateur-azote", "petit-fruit", "petit-fruit"],
    couleur: "#4A7A5A",
  },
  {
    id: "coin-pollinisateurs",
    nom: "Coin des pollinisateurs",
    axe: "objectif",
    emoji: "🐝",
    zoneMin: 2,
    objectifs: ["Pollinisateurs", "Biodiversité", "Ornemental"],
    milieux: ["plein soleil"],
    desc: "Un massif de plantes mellifères à floraisons échelonnées pour soutenir abeilles et papillons de mai à septembre. Attire les pollinisateurs vers tout l'aménagement.",
    roles: ["petit-fruit", "pollinisateur", "pollinisateur", "accumulateur"],
    couleur: "#F39C12",
  },
  {
    id: "bande-riveraine",
    nom: "Bande riveraine productive",
    axe: "milieu",
    emoji: "💧",
    zoneMin: 2,
    objectifs: ["Bande riveraine", "Stabilisation", "Nourriture faune"],
    milieux: ["sol humide", "bord de l'eau", "mal drainé"],
    desc: "Pour les zones humides ou en bordure de cours d'eau : stabilise les berges, filtre l'eau et produit des fruits, avec des espèces indigènes qui aiment avoir les pieds mouillés.",
    roles: ["fixateur-azote", "riveraine", "petit-fruit", "couvre-sol"],
    couleur: "#1ABC9C",
  },
  {
    id: "verger-sec",
    nom: "Verger de terrain sec",
    axe: "milieu",
    emoji: "☀️",
    zoneMin: 2,
    objectifs: ["Comestible", "Résistance sécheresse"],
    milieux: ["sol léger", "sec", "pente sud"],
    desc: "Pour les sols légers et secs exposés au soleil : des espèces tolérantes à la sécheresse comme l'argousier, avec un couvre-sol qui retient l'humidité.",
    roles: ["arbre-central", "fixateur-azote", "couvre-sol", "accumulateur"],
    couleur: "#E67E22",
  },
];

export const ROLE_LABELS: Record<string, string> = {
  "arbre-central": "Arbre central",
  "canopee": "Canopée / structure",
  "fixateur-azote": "Fixateur d'azote",
  "petit-fruit": "Petit fruit",
  "accumulateur": "Accumulateur de nutriments",
  "pollinisateur": "Pollinisateur",
  "couvre-sol": "Couvre-sol",
  "riveraine": "Espèce riveraine",
};

/** Filtre les guildes-modèles disponibles pour une zone de rusticité donnée. */
export function templatesForZone(clientZone?: string | null): GuildTemplate[] {
  const z = zoneToNumber(clientZone);
  return GUILD_TEMPLATES.filter((t) => t.zoneMin <= z);
}

export function templateById(id: string): GuildTemplate | null {
  return GUILD_TEMPLATES.find((t) => t.id === id) ?? null;
}
