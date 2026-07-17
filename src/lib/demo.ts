import type { ParcoursId } from "./parcours";
import type { TerrainProfile } from "@/types/terrain";
import type { GeneratedGuild, GuildTemplate, GuildRecommendationResponse } from "@/types/guild";
import type { RoleGuilde } from "@/types/plant";
import { plantsForZone } from "./plants";
import { GUILD_TEMPLATES, ROLE_LABELS, templatesForZone } from "./guilds";

// Mode démo : utilisé par /api/chat quand ANTHROPIC_API_KEY est absente, pour que
// l'interface reste testable de bout en bout sans dépendre d'un vrai appel IA.

const DEMO_STEPS_FULL = [
  "Bonjour ! 👋 Je suis Sylvie (mode démo — sans appel à l'IA). Pour commencer : dans quelle région se trouve votre terrain, et quelle est sa superficie approximative ?",
  "Merci ! Et le terrain : quel type de sol (léger, moyen, lourd), plutôt ensoleillé, mi-ombragé ou humide ?",
  "Parfait, noté. Avez-vous des contraintes particulières : budget approximatif, présence d'animaux, délai souhaité pour le projet ?",
  "Bien reçu. Pour terminer : quelles sont vos priorités (comestible, biodiversité, esthétique...) et des espèces que vous aimeriez ou souhaitez éviter ?",
];

const DEMO_STEPS_EXPRESS = [
  "Salut ! Sylvie ici (mode démo — sans appel à l'IA). Donne-moi vite : région, superficie, type de sol et ensoleillement.",
  "Noté. Objectifs de production et espèces désirées/à éviter ?",
];

function demoSynthese(parcoursId: ParcoursId): string {
  const niveau: TerrainProfile["profil"]["experience_jardinage"] =
    parcoursId === "expert" ? "avancé" : parcoursId === "intermediaire" ? "intermédiaire" : "débutant";

  const json: TerrainProfile = {
    profil: {
      prenom: "Alex",
      experience_jardinage: niveau,
      objectif_principal: "Aménagement comestible et écologique",
      contexte: "Terrain résidentiel, première expérience en permaculture",
    },
    localisation: {
      region: "Chaudière-Appalaches",
      municipalite: "Lévis",
      zone_rusticite: "4b",
      exposition_generale: "plein soleil",
    },
    terrain: {
      superficie_m2: 450,
      topographie: "légère pente",
      sol_texture: "moyen",
      sol_drainage: "bien drainé",
      ensoleillement: "plein soleil",
      presence_eau: false,
      description_eau: "",
    },
    contraintes: {
      budget_estime: "3000-5000$",
      presence_animaux: false,
      type_animaux: "",
      delai_projet: "Ce printemps",
    },
    vision: {
      priorites: ["Comestible", "Biodiversité"],
      especes_desirees: ["Pommier", "Framboisier"],
      especes_a_eviter: [],
    },
    recommandations_preliminaires: {
      type_amenagement: "Guilde fruitière",
      guildes_suggerees: ["guilde-pommier"],
      points_attention: ["Ceci est une synthèse de démonstration (mode sans IA)."],
    },
  };

  return (
    "Merci ! Voici le résumé de votre projet. ⚠️ Ceci est une synthèse de démonstration générée sans appel à l'IA — ajoutez votre clé ANTHROPIC_API_KEY dans .env.local pour un vrai diagnostic personnalisé.\n\n" +
    `<SYNTHESE_JSON>\n${JSON.stringify(json, null, 2)}\n</SYNTHESE_JSON>`
  );
}

/** Retourne la réplique scriptée de Sylvie en mode démo pour ce tour de conversation. */
export function getDemoReply(turnIndex: number, parcoursId: ParcoursId): string {
  const steps = parcoursId === "expert" ? DEMO_STEPS_EXPRESS : DEMO_STEPS_FULL;
  if (turnIndex < steps.length) {
    return steps[turnIndex];
  }
  return demoSynthese(parcoursId);
}

/** Recommandation de démonstration (sans IA) : répartit la superficie entre 1 à 3 guildes. */
export function getDemoRecommendation(
  terrain: TerrainProfile,
  superficie: number,
): GuildRecommendationResponse {
  const zone = terrain?.localisation?.zone_rusticite ?? "3";
  const available = templatesForZone(zone);
  const count = superficie > 700 ? Math.min(3, available.length) : superficie > 300 ? Math.min(2, available.length) : Math.min(1, available.length);
  const chosen = available.slice(0, Math.max(count, 1));

  return {
    recommandations: chosen.map((t) => ({
      template_id: t.id,
      raison: `Guilde de démonstration compatible avec votre zone ${zone}.`,
      superficie_allouee_m2: Math.round(superficie / chosen.length),
    })),
    logique_ensemble:
      "Répartition égale de la superficie entre les guildes sélectionnées (mode démo, sans appel à l'IA).",
  };
}

function pickPlantForRole(role: RoleGuilde, zone: string, used: Set<number>) {
  const candidates = plantsForZone(zone).filter((p) => p.roleGuilde === role && !used.has(p.id));
  candidates.sort((a, b) => Number(b.indigene) - Number(a.indigene));
  return candidates[0] ?? null;
}

/** Guilde de démonstration (sans IA) : remplit chaque rôle du modèle avec une plante compatible. */
export function getDemoGuild(
  template: GuildTemplate | null,
  terrain: TerrainProfile,
  superficie: number,
): GeneratedGuild {
  const zone = terrain?.localisation?.zone_rusticite ?? "3";
  const tpl = template ?? templatesForZone(zone)[0] ?? GUILD_TEMPLATES[0];
  const used = new Set<number>();
  const plantes: GeneratedGuild["plantes"] = [];
  let distance = 1.5;

  tpl.roles.forEach((role, idx) => {
    const plant = pickPlantForRole(role, zone, used);
    if (!plant) return;
    used.add(plant.id);
    const isCentral = role === "arbre-central";
    plantes.push({
      nom: plant.nom,
      quantite: isCentral ? 1 : Math.max(1, Math.round(superficie / 150)),
      orientation: plant.orientation_preferee,
      distance: isCentral ? 0 : Math.round(distance * 10) / 10,
      role_dans_guilde: ROLE_LABELS[role] ?? role,
      priorite: idx < 2 ? "obligatoire" : "recommandé",
    });
    if (!isCentral) distance += 1.2;
  });

  return {
    nom: tpl.nom,
    description: `${tpl.desc} (guilde de démonstration, générée sans appel à l'IA).`,
    milieu_analyse: `Terrain en zone ${zone}, ${superficie}m², exposition ${
      terrain?.terrain?.ensoleillement ?? "non précisée"
    }.`,
    plantes,
    logique_spatiale:
      "Disposition en cercles concentriques autour de l'élément central, orientée selon les préférences de chaque espèce (mode démo).",
    sequence_plantation:
      "1. Élément central/structurant. 2. Fixateurs d'azote. 3. Reste des espèces de la guilde.",
    synergies_cles: ["Ceci est une guilde de démonstration — activez l'API pour une analyse personnalisée."],
    points_attention: ["Guilde générée automatiquement sans IA (mode démo)."],
  };
}
