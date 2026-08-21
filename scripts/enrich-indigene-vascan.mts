// Interroge l'API VASCAN/Canadensys (https://data.canadensys.net/vascan/api,
// CC-BY-SA 3.0) pour déterminer le statut indigène (Québec) de chaque espèce
// de la table `plantes`, et met à jour les colonnes `indigene`/`indigene_source`.
//
// Requiert la migration add_indigene_status déjà appliquée.
// Usage : npx tsx scripts/enrich-indigene-vascan.mts [--dry-run]
import { config } from "dotenv";
config({ path: ".env.local" });

import { getPrisma } from "../src/db/client";

const VASCAN_URL = "https://data.canadensys.net/vascan/api/0.1/search.json";
const BATCH_SIZE = 150;
const DRY_RUN = process.argv.includes("--dry-run");

interface VascanDistribution {
  locality: string;
  establishmentMeans: string;
  occurrenceStatus: string;
}
interface VascanMatch {
  taxonID: number;
  canonicalName: string;
  distribution?: VascanDistribution[];
}
interface VascanResult {
  searchedTerm: string;
  numMatches: number;
  matches: VascanMatch[];
}
interface VascanResponse {
  results: VascanResult[];
}

/** Nettoie un nom latin pour la recherche VASCAN : retire cultivars/hybrides/sous-espèces
 * pour matcher l'espèce de base (le statut indigène se juge à ce niveau). */
function cleanSearchName(genre: string, espece: string | null): string {
  let e = (espece ?? "").trim();
  e = e.split(/\s+var[.\s]/i)[0];
  e = e.split(/\s+ssp[.\s]/i)[0];
  e = e.split(/\s+subsp[.\s]/i)[0];
  e = e.split(/\s+cv[.\s]/i)[0];
  e = e.split(/\s+x\s+/i)[0];
  e = e.replace(/\bsp\.?$/i, "").trim();
  return `${genre} ${e}`.trim();
}

async function searchVascanBatch(names: string[]): Promise<VascanResult[]> {
  const body = new URLSearchParams();
  body.set("q", names.join("\n"));
  const res = await fetch(VASCAN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`VASCAN HTTP ${res.status}`);
  const data = (await res.json()) as VascanResponse;
  return data.results;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const prisma = getPrisma();
  const plantes = await prisma.plante.findMany({
    select: { id: true, slug: true, genre: true, espece: true, nomFrancais: true },
    orderBy: { id: "asc" },
  });
  console.log(`${plantes.length} espèces à vérifier contre VASCAN...`);

  const searchNames = plantes.map((p) => cleanSearchName(p.genre, p.espece));
  const resultsByTerm = new Map<string, VascanResult>();

  for (const batch of chunk(searchNames, BATCH_SIZE)) {
    const results = await searchVascanBatch(batch);
    for (const r of results) resultsByTerm.set(r.searchedTerm, r);
  }

  const today = new Date().toISOString().slice(0, 10);
  let native = 0;
  let introduced = 0;
  let excluded = 0; // ex: "ephemeral", "exotic", "extirpated" etc. — traité comme non-indigène
  const noMatch: string[] = [];
  const noQcData: string[] = [];

  for (const p of plantes) {
    const term = cleanSearchName(p.genre, p.espece);
    const result = resultsByTerm.get(term);

    if (!result || result.numMatches === 0) {
      noMatch.push(`${p.nomFrancais ?? p.slug} — "${term}"`);
      continue;
    }

    const match = result.matches[0];
    const qc = match.distribution?.find((d) => d.locality === "QC");
    if (!qc) {
      noQcData.push(`${p.nomFrancais ?? p.slug} — "${term}" (taxonID ${match.taxonID})`);
      continue;
    }

    const isNative = qc.establishmentMeans === "native";
    if (isNative) native++;
    else if (qc.establishmentMeans === "introduced") introduced++;
    else excluded++;

    const source = `VASCAN taxonID ${match.taxonID}, establishmentMeans="${qc.establishmentMeans}" (QC), vérifié ${today}`;

    if (!DRY_RUN) {
      await prisma.plante.update({
        where: { id: p.id },
        data: { indigene: isNative, indigeneSource: source },
      });
    }
  }

  console.log("\n=== Résultat ===");
  console.log(`Indigène (native)     : ${native}`);
  console.log(`Introduit             : ${introduced}`);
  console.log(`Autre statut QC       : ${excluded}`);
  console.log(`Sans correspondance VASCAN (${noMatch.length}) :`);
  for (const n of noMatch) console.log(`  - ${n}`);
  console.log(`Correspondance trouvée mais pas de donnée QC (${noQcData.length}) :`);
  for (const n of noQcData) console.log(`  - ${n}`);

  if (DRY_RUN) console.log("\n(--dry-run : aucune écriture en base)");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
