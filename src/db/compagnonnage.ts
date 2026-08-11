/**
 * Score de compatibilité entre plantes d'un même agencement/strate.
 *
 * Principe : deux mécanismes complémentaires, pas un seul.
 *   1. Heuristique automatique (racine, fixateurAzote) — fonctionne sur
 *      TOUTES les espèces sans curation manuelle.
 *   2. Table `compagnonnage` — cas connus qu'aucun champ structuré ne peut
 *      déduire (toxicité, allélopathie). Complète l'heuristique, ne la
 *      remplace pas : l'absence d'entrée dans `compagnonnage` ne veut PAS
 *      dire "compatible garanti", juste "rien de connu contre".
 *
 * `racine` et `fixateurAzote` sont de vraies colonnes de la table `plantes`
 * (pas des champs déduits comme le sont roleGuilde/strate dans
 * src/db/plants.ts) — voir getPlantesCompagnonnage() ci-dessous pour où on
 * les récupère.
 *
 * Encore non branché sur le générateur de guildes — voir src/db/plants.ts
 * pour le pipeline réellement utilisé par /api/guilde/generate.
 */

import { getPrisma } from "./client";

export interface PlanteCompagnonnage {
  id: number;
  slug: string;
  racine: string[];
  fixateurAzote: boolean | null;
}

export interface ScoreCompatibilite {
  score: number; // -Infinity si antagonisme connu (exclusion), sinon 0+ (plus haut = mieux)
  raisons: string[];
  antagonismeDetecte: boolean;
}

/** Récupère les champs bruts (racine, fixateurAzote) nécessaires au scoring pour un lot d'ids. */
export async function getPlantesCompagnonnage(ids: number[]): Promise<PlanteCompagnonnage[]> {
  if (ids.length === 0) return [];
  const rows = await getPrisma().plante.findMany({
    where: { id: { in: ids.map((id) => BigInt(id)) } },
    select: { id: true, slug: true, racine: true, fixateurAzote: true },
  });
  return rows.map((r) => ({
    id: Number(r.id),
    slug: r.slug,
    racine: r.racine,
    fixateurAzote: r.fixateurAzote,
  }));
}

/**
 * Score un groupe de plantes candidates pour un même emplacement/strate.
 * Ne fait PAS de sélection elle-même — retourne un score à utiliser pour
 * comparer/classer des combinaisons candidates (voir `meilleureCombinaison`).
 */
export async function scorerGroupe(plantes: PlanteCompagnonnage[]): Promise<ScoreCompatibilite> {
  if (plantes.length < 2) {
    return { score: 0, raisons: [], antagonismeDetecte: false };
  }

  let score = 0;
  const raisons: string[] = [];

  // ---- 1. Diversité des types de racines ----
  // Compte les types distincts parmi les racines déclarées (une plante peut
  // avoir plusieurs types, ex: superficiel + latérales).
  const typesRacinesVus = new Set<string>();
  for (const p of plantes) {
    for (const t of p.racine ?? []) typesRacinesVus.add(t);
  }
  const diversiteRacines = typesRacinesVus.size;
  if (diversiteRacines >= plantes.length) {
    score += 2;
    raisons.push(
      `Bonne diversité racinaire (${diversiteRacines} types distincts pour ${plantes.length} espèces) — partage vertical du sol`,
    );
  } else if (diversiteRacines === 1 && plantes.length > 1) {
    score -= 1;
    raisons.push(
      "Toutes les plantes ont le même type de racine — compétition probable pour la même strate de sol",
    );
  }

  // ---- 2. Synergie azote (plafonnée à 2 fixateurs utiles) ----
  // Au-delà de 2, un fixateur de plus n'apporte pas de bénéfice azote
  // supplémentaire ici, et prend la place d'une espèce productive — donc
  // pénalité plutôt que bonus supplémentaire.
  const fixateurs = plantes.filter((p) => p.fixateurAzote === true);
  const nonFixateurs = plantes.filter((p) => p.fixateurAzote === false || p.fixateurAzote === null);
  const fixateursUtiles = Math.min(fixateurs.length, 2);
  if (fixateursUtiles > 0 && nonFixateurs.length > 0) {
    score += 1.5;
    raisons.push(
      `${fixateursUtiles} fixateur(s) d'azote utile(s) présent(s), profite aux ${nonFixateurs.length} autres espèces du groupe`,
    );
  }
  if (fixateurs.length > 2) {
    const exces = fixateurs.length - 2;
    score -= 0.5 * exces;
    raisons.push(
      `${exces} fixateur(s) au-delà du plafond de 2 : pas de bénéfice azote additionnel, et ça laisse moins de place à des espèces productives`,
    );
  }

  // ---- 3. Antagonismes connus (table compagnonnage) ----
  const ids = plantes.map((p) => p.id).sort((a, b) => a - b);
  const paires: [number, number][] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) paires.push([ids[i], ids[j]]);
  }

  if (paires.length > 0) {
    try {
      const relations = await getPrisma().compagnonnage.findMany({
        where: {
          OR: paires.map(([a, b]) => ({
            planteAId: BigInt(a),
            planteBId: BigInt(b),
          })),
        },
      });

      for (const rel of relations) {
        if (rel.relation === "antagoniste") {
          return {
            score: -Infinity,
            raisons: [
              ...raisons,
              `Antagonisme connu : ${rel.raison ?? "raison non précisée"} (confiance: ${rel.confiance})`,
            ],
            antagonismeDetecte: true,
          };
        }
        if (rel.relation === "benefique") {
          score += 1;
          raisons.push(`Association bénéfique connue : ${rel.raison ?? ""}`);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "erreur inconnue";
      raisons.push(`Impossible de vérifier les antagonismes connus (${message}) — score calculé sans cette info`);
    }
  }

  return { score, raisons, antagonismeDetecte: false };
}

/**
 * Parmi une liste de candidats pour une strate, choisit une combinaison de
 * `taille` espèces qui maximise le score de compatibilité. Force brute sur
 * toutes les combinaisons — acceptable pour de petits groupes (jusqu'à ~15
 * candidats, ~4 sélectionnés). Si les listes de candidats deviennent plus
 * grandes, remplacer par une sélection gloutonne (ajouter un candidat à la
 * fois, celui qui améliore le plus le score) plutôt que la force brute.
 */
export async function meilleureCombinaison(
  candidats: PlanteCompagnonnage[],
  taille: number,
): Promise<{ groupe: PlanteCompagnonnage[]; score: ScoreCompatibilite } | null> {
  if (candidats.length <= taille) {
    const score = await scorerGroupe(candidats);
    return { groupe: candidats, score };
  }

  function* combinaisons<T>(arr: T[], k: number): Generator<T[]> {
    if (k === 0) {
      yield [];
      return;
    }
    for (let i = 0; i <= arr.length - k; i++) {
      for (const reste of combinaisons(arr.slice(i + 1), k - 1)) {
        yield [arr[i], ...reste];
      }
    }
  }

  let meilleur: { groupe: PlanteCompagnonnage[]; score: ScoreCompatibilite } | null = null;
  for (const combo of combinaisons(candidats, taille)) {
    const score = await scorerGroupe(combo);
    if (!meilleur || score.score > meilleur.score.score) {
      meilleur = { groupe: combo, score };
    }
  }
  return meilleur;
}
