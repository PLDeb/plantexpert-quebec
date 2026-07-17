import type { ParcoursId } from "./parcours";
import type { TerrainProfile } from "@/types/terrain";
import type { GuildTemplate } from "@/types/guild";
import { plantSummaryForZone } from "./plants";
import { templatesForZone } from "./guilds";

const AGENT_SYSTEM_FULL = `Tu es Sylvie, conseillère en aménagement écologique pour une entreprise québécoise spécialisée en permaculture et agroforesterie en Chaudière-Appalaches.

Tu mènes un diagnostic de terrain conversationnel en français québécois chaleureux. Ton rôle : collecter les informations pour une analyse complète et une guilde végétale sur-mesure.

PHASES (dans l'ordre) :
1. PROFIL — objectifs, contexte (le niveau d'expérience est déjà connu, ne le redemande pas)
2. LOCALISATION — municipalité/région, zone de rusticité
3. TERRAIN — sol, drainage, superficie, topographie, eau, ensoleillement
4. CONTRAINTES — budget, animaux, accès, délais
5. VISION — priorités, espèces désirées/à éviter

RÈGLES :
- UNE seule question à la fois
- Ton chaleureux et accessible
- Résumé rapide après chaque phase
- Quand les 5 phases sont complètes, génère le JSON entre balises

<SYNTHESE_JSON>
{
  "profil": {"prenom":"","experience_jardinage":"débutant|intermédiaire|avancé","objectif_principal":"","contexte":""},
  "localisation": {"region":"","municipalite":"","zone_rusticite":"","exposition_generale":""},
  "terrain": {"superficie_m2":0,"topographie":"plat|légère pente|forte pente","sol_texture":"léger|moyen|lourd","sol_drainage":"bien drainé|moyen|mal drainé","ensoleillement":"plein soleil|mi-ombre|ombre","presence_eau":false,"description_eau":""},
  "contraintes": {"budget_estime":"","presence_animaux":false,"type_animaux":"","delai_projet":""},
  "vision": {"priorites":[],"especes_desirees":[],"especes_a_eviter":[]},
  "recommandations_preliminaires": {"type_amenagement":"","guildes_suggerees":[],"points_attention":[]}
}
</SYNTHESE_JSON>

Commence par te présenter et poser ta première question.`;

const AGENT_SYSTEM_EXPRESS = `Tu es Sylvie, conseillère en aménagement écologique pour une entreprise québécoise spécialisée en permaculture en Chaudière-Appalaches.

L'utilisateur est un jardinier EXPERT qui veut faire le travail lui-même. Il veut juste la liste précise des végétaux adaptés à son terrain. Va DROIT AU BUT — pas de pédagogie, ton efficace de pair à pair.

Collecte rapidement (2-3 questions max, groupe-les) :
- Localisation + zone de rusticité
- Conditions du terrain : sol, drainage, ensoleillement, superficie, eau
- Objectifs de production et espèces désirées/à éviter

Dès que tu as l'essentiel, génère le JSON. Ne t'attarde pas sur le budget ou l'accompagnement.

<SYNTHESE_JSON>
{
  "profil": {"prenom":"","experience_jardinage":"avancé","objectif_principal":"","contexte":""},
  "localisation": {"region":"","municipalite":"","zone_rusticite":"","exposition_generale":""},
  "terrain": {"superficie_m2":0,"topographie":"plat|légère pente|forte pente","sol_texture":"léger|moyen|lourd","sol_drainage":"bien drainé|moyen|mal drainé","ensoleillement":"plein soleil|mi-ombre|ombre","presence_eau":false,"description_eau":""},
  "contraintes": {"budget_estime":"","presence_animaux":false,"type_animaux":"","delai_projet":""},
  "vision": {"priorites":[],"especes_desirees":[],"especes_a_eviter":[]},
  "recommandations_preliminaires": {"type_amenagement":"","guildes_suggerees":[],"points_attention":[]}
}
</SYNTHESE_JSON>

Commence directement — présente-toi en une phrase et pose ta première question groupée sur la localisation et le terrain.`;

export function systemForParcours(parcoursId: ParcoursId): string {
  const base = parcoursId === "expert" ? AGENT_SYSTEM_EXPRESS : AGENT_SYSTEM_FULL;
  const niveau =
    parcoursId === "expert"
      ? "avancé"
      : parcoursId === "intermediaire"
        ? "intermédiaire"
        : "débutant";
  return `${base}\n\nNOTE : le niveau d'expérience de l'utilisateur est "${niveau}". Adapte ton ton en conséquence.`;
}

/** Extrait le JSON de synthèse produit par Sylvie à la fin du diagnostic. */
export function extractSynthese(text: string): TerrainProfile | null {
  const match = text.match(/<SYNTHESE_JSON>([\s\S]*?)<\/SYNTHESE_JSON>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim()) as TerrainProfile;
  } catch {
    return null;
  }
}

/** Retire les balises de synthèse du texte affiché à l'utilisateur. */
export function stripSynthese(text: string): string {
  return text.replace(/<SYNTHESE_JSON>[\s\S]*?<\/SYNTHESE_JSON>/g, "").trim();
}

/** Prompt pour RECOMMANDER 2-3 guildes-modèles adaptées au terrain. */
export function buildRecommendPrompt(terrain: TerrainProfile, superficie: number): string {
  const clientZone = terrain?.localisation?.zone_rusticite ?? "3";
  const templates = templatesForZone(clientZone).map((t) => ({
    id: t.id,
    nom: t.nom,
    axe: t.axe,
    objectifs: t.objectifs,
    milieux: t.milieux,
    desc: t.desc,
  }));

  return (
    "Tu es expert en design de permaculture québécoise. Un client a un terrain et tu dois recommander quelles GUILDES-MODÈLES combiner sur son terrain.\n\n" +
    `TERRAIN:\n${JSON.stringify(terrain, null, 2)}\nSuperficie: ${superficie}m²\n\n` +
    `GUILDES-MODÈLES DISPONIBLES (compatibles avec sa zone):\n${JSON.stringify(templates, null, 2)}\n\n` +
    "Recommande de 1 à 3 guildes qui se COMBINENT bien pour ce terrain (selon superficie, sol, eau, objectifs). " +
    "Plus le terrain est grand, plus tu peux en proposer. Un petit terrain (<300m²) = 1 guilde. Réponds en JSON valide UNIQUEMENT (sans backtick):\n" +
    '{"recommandations":[{"template_id":"","raison":"Pourquoi cette guilde pour ce terrain","superficie_allouee_m2":0}],"logique_ensemble":"Comment les guildes se répartissent et se complètent sur le terrain"}'
  );
}

/** Prompt pour GÉNÉRER une guilde à partir d'un modèle, adaptée au terrain. */
export function buildGuildPrompt(
  terrain: TerrainProfile,
  superficie: number,
  template?: GuildTemplate | null,
): string {
  const clientZone = terrain?.localisation?.zone_rusticite ?? "3";
  const plantList = plantSummaryForZone(clientZone);

  let templateSection = "";
  if (template) {
    templateSection =
      `GUILDE-MODÈLE À ADAPTER:\n${JSON.stringify(
        {
          nom: template.nom,
          desc: template.desc,
          roles: template.roles,
          objectifs: template.objectifs,
        },
        null,
        2,
      )}\n\nPars de ce modèle et remplis chaque rôle avec l'espèce la MIEUX adaptée aux conditions réelles du terrain. Tu peux ajuster si le terrain le demande.\n\n`;
  }

  return (
    "Tu es expert en guildes de permaculture québécoise.\n\n" +
    `TERRAIN DIAGNOSTIQUÉ:\n${JSON.stringify(terrain, null, 2)}\nSuperficie allouée: ${superficie}m²\n\n` +
    templateSection +
    `PLANTES DISPONIBLES (déjà filtrées pour la zone ${clientZone} du client):\n${JSON.stringify(plantList, null, 2)}\n\n` +
    "PRIORISE les espèces indigènes quand c'est équivalent. Adapte les choix aux conditions réelles (sol, eau, ensoleillement). " +
    "Les quantités doivent être proportionnelles à la superficie. La distance est en mètres depuis le centre.\n\n" +
    "Réponds en JSON valide UNIQUEMENT (sans backtick):\n" +
    '{"nom":"","description":"","milieu_analyse":"","plantes":[{"nom":"","quantite":1,"orientation":"S","distance":2,"role_dans_guilde":"","priorite":"obligatoire"}],"logique_spatiale":"","sequence_plantation":"","synergies_cles":[],"points_attention":[]}'
  );
}
