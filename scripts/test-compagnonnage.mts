// Test isolé du scoring de compagnonnage (src/db/compagnonnage.ts), PAS branché
// sur le générateur de guildes. Change `zone`/`strate` ci-dessous pour explorer
// d'autres regroupements. Usage : npx tsx scripts/test-compagnonnage.mts
import { config } from "dotenv";
config({ path: ".env.local" });

import { getAllPlantesEnrichies } from "../src/db/plants";
import { getPlantesCompagnonnage, meilleureCombinaison } from "../src/db/compagnonnage";

async function main() {
  const zone = "4";
  const strate = "arbustive-haute";

  const all = await getAllPlantesEnrichies();
  const candidatsZone = all.filter((p) => p.zoneMin <= Number(zone) && p.strate === strate);
  console.log(`Candidats strate "${strate}" en zone ${zone} : ${candidatsZone.length}`);

  const pris = candidatsZone.slice(0, 6);
  console.log(
    "Candidats retenus pour le test :",
    pris.map((p) => `${p.nom} (id ${p.id})`),
  );

  const details = await getPlantesCompagnonnage(pris.map((p) => p.id));
  console.log("\nDétails bruts (racine / fixateurAzote) :");
  for (const d of details) {
    console.log(`  ${d.slug.padEnd(30)} racine=${JSON.stringify(d.racine).padEnd(35)} fixateurAzote=${d.fixateurAzote}`);
  }

  const resultat = await meilleureCombinaison(details, 4);

  console.log("\n=== MEILLEUR GROUPE (taille 4) ===");
  if (!resultat) {
    console.log("Aucun résultat.");
  } else {
    const noms = resultat.groupe.map((p) => {
      const full = pris.find((c) => c.id === p.id);
      return full ? full.nom : p.slug;
    });
    console.log("Groupe choisi :", noms);
    console.log("Score total  :", resultat.score.score);
    console.log("Raisons      :");
    for (const r of resultat.score.raisons) console.log("  -", r);
    console.log("Antagonisme détecté :", resultat.score.antagonismeDetecte);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
