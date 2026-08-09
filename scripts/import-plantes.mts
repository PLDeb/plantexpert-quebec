// Charge scripts/data/plantes_final.json (produit par decode-plantes-sheet.py)
// dans la table `plantes` de Supabase. Vide et recharge la table à chaque
// exécution (idempotent) — pratique pour réimporter après une mise à jour
// du sheet source ou un ajustement du décodeur.
//
// Usage : npx tsx scripts/import-plantes.mts
import { readFileSync } from "node:fs";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });

interface DecodedPlante {
  slug: string;
  genre: string;
  espece: string | null;
  variete: string | null;
  nomFrancais: string | null;
  nomAnglais: string | null;
  zoneRusticite: string | null;
  lumiere: string[];
  eau: string[];
  phMin: number | null;
  phMax: number | null;
  textureSol: string[];
  forme: string | null;
  racine: string[];
  hauteurMinM: number | null;
  hauteurMaxM: number | null;
  largeurMinM: number | null;
  largeurMaxM: number | null;
  fixateurAzote: boolean | null;
  accumulateurNutriments: boolean | null;
  vieSauvage: string[];
  pollinisateurs: string[];
  couvreSol: boolean | null;
  haie: boolean | null;
  utilisationEcologique: string[];
  comestible: string[];
  medicinal: boolean | null;
  periodeFloraison: string[];
  couleurFloraison: string[];
  couleurFeuillage: string[];
  interetAutomneHiver: string[];
  rythmeCroissance: string | null;
  periodeTaille: string[];
  multiplication: string[];
  inconvenients: string[];
  notes: string | null;
  cultivarsRecommandes: string | null;
  lienInfo: string | null;
  sourceSheet: string | null;
  donneesBrutes: Record<string, unknown>;
  pepinieres: number[];
}

const records: DecodedPlante[] = JSON.parse(
  readFileSync(new URL("./data/plantes_final.json", import.meta.url), "utf8"),
);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.plantePepiniere.deleteMany({});
  await prisma.plante.deleteMany({});

  let created = 0;
  let junctions = 0;

  for (const r of records) {
    const plante = await prisma.plante.create({
      data: {
        slug: r.slug,
        genre: r.genre,
        espece: r.espece,
        variete: r.variete,
        nomFrancais: r.nomFrancais,
        nomAnglais: r.nomAnglais,
        zoneRusticite: r.zoneRusticite,
        lumiere: r.lumiere,
        eau: r.eau,
        phMin: r.phMin,
        phMax: r.phMax,
        textureSol: r.textureSol,
        forme: r.forme,
        racine: r.racine,
        hauteurMinM: r.hauteurMinM,
        hauteurMaxM: r.hauteurMaxM,
        largeurMinM: r.largeurMinM,
        largeurMaxM: r.largeurMaxM,
        fixateurAzote: r.fixateurAzote,
        accumulateurNutriments: r.accumulateurNutriments,
        vieSauvage: r.vieSauvage,
        pollinisateurs: r.pollinisateurs,
        couvreSol: r.couvreSol,
        haie: r.haie,
        utilisationEcologique: r.utilisationEcologique,
        comestible: r.comestible,
        medicinal: r.medicinal,
        periodeFloraison: r.periodeFloraison,
        couleurFloraison: r.couleurFloraison,
        couleurFeuillage: r.couleurFeuillage,
        interetAutomneHiver: r.interetAutomneHiver,
        rythmeCroissance: r.rythmeCroissance,
        periodeTaille: r.periodeTaille,
        multiplication: r.multiplication,
        inconvenients: r.inconvenients,
        notes: r.notes,
        cultivarsRecommandes: r.cultivarsRecommandes,
        lienInfo: r.lienInfo,
        sourceSheet: r.sourceSheet,
        donneesBrutes: r.donneesBrutes as Prisma.InputJsonValue,
        verifie: false,
      },
    });
    created += 1;

    for (const pepId of r.pepinieres || []) {
      await prisma.plantePepiniere.create({
        data: { planteId: plante.id, pepiniereId: pepId },
      });
      junctions += 1;
    }
  }

  console.log(`${created} plantes créées, ${junctions} liens pépinières créés.`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
