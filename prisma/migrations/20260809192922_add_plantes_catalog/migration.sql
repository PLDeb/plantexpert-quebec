-- CreateTable
CREATE TABLE "plantes" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "espece" TEXT,
    "variete" TEXT,
    "nom_francais" TEXT,
    "nom_anglais" TEXT,
    "zone_rusticite" TEXT,
    "lumiere" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "eau" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ph_min" DECIMAL(3,1),
    "ph_max" DECIMAL(3,1),
    "texture_sol" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "forme" TEXT,
    "racine" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hauteur_min_m" DECIMAL(5,2),
    "hauteur_max_m" DECIMAL(5,2),
    "largeur_min_m" DECIMAL(5,2),
    "largeur_max_m" DECIMAL(5,2),
    "fixateur_azote" BOOLEAN,
    "accumulateur_nutriments" BOOLEAN,
    "vie_sauvage" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pollinisateurs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "couvre_sol" BOOLEAN,
    "haie" BOOLEAN,
    "utilisation_ecologique" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "comestible" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "medicinal" BOOLEAN,
    "periode_floraison" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "couleur_floraison" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "couleur_feuillage" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interet_automne_hiver" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rythme_croissance" TEXT,
    "periode_taille" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "multiplication" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "inconvenients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "cultivars_recommandes" TEXT,
    "lien_info" TEXT,
    "source_sheet" TEXT,
    "donnees_brutes" JSONB,
    "verifie" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pepinieres" (
    "id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "pepinieres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantes_pepinieres" (
    "plante_id" BIGINT NOT NULL,
    "pepiniere_id" INTEGER NOT NULL,

    CONSTRAINT "plantes_pepinieres_pkey" PRIMARY KEY ("plante_id","pepiniere_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plantes_slug_key" ON "plantes"("slug");

-- CreateIndex
CREATE INDEX "plantes_zone_rusticite_idx" ON "plantes"("zone_rusticite");

-- CreateIndex
CREATE INDEX "plantes_forme_idx" ON "plantes"("forme");

-- AddForeignKey
ALTER TABLE "plantes_pepinieres" ADD CONSTRAINT "plantes_pepinieres_plante_id_fkey" FOREIGN KEY ("plante_id") REFERENCES "plantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantes_pepinieres" ADD CONSTRAINT "plantes_pepinieres_pepiniere_id_fkey" FOREIGN KEY ("pepiniere_id") REFERENCES "pepinieres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- Ajouts SQL bruts (non exprimables par le schéma Prisma) :
-- extension pg_trgm, trigger updated_at, RLS, index GIN/trgm,
-- données de référence des pépinières.
-- ============================================================

-- Extension pour recherche texte floue (nom latin/français/anglais)
create extension if not exists pg_trgm;

-- Données de référence : pépinières / centres jardins
insert into pepinieres (id, nom, url) values
    (1,  'Arbres-Fruitiers',            'http://www.arbres-fruitiers.ca/'),
    (2,  'Pépinière Ancestrale',        'http://www.pepiniereancestrale.com/'),
    (3,  'Cultiver l''abondance',       'http://www.cultiverlabondance.com'),
    (4,  'Horticulture Indigo',         'http://www.horticulture-indigo.com/'),
    (5,  'Pépinière Casse-Noisette',    'http://www.cassenoisettepepiniere.com/'),
    (6,  'Green Barn Nursery',          'http://www.greenbarnnursery.ca/'),
    (7,  'Arboquebecium',               'http://www.arboquebecium.com/fr/'),
    (8,  'Pépinière Vert Forêt',        'http://www.arbresenligne.com/'),
    (9,  'Jardin Jasmin',               'http://www.jardinjasmin.com/'),
    (10, 'Jardin Deux-Montagnes',       'http://jardin2m.com/'),
    (11, 'Pépinière Saint-Nicolas',     'http://www.psn3.com/'),
    (12, 'Pépinière Auclair et Frères', 'http://www.pepiniereauclairetfreres.com/')
on conflict (id) do nothing;

-- Index GIN pour les filtres facettés (tableaux) et la recherche floue
create index if not exists idx_plantes_lumiere      on plantes using gin (lumiere);
create index if not exists idx_plantes_eau          on plantes using gin (eau);
create index if not exists idx_plantes_texture      on plantes using gin (texture_sol);
create index if not exists idx_plantes_comestible   on plantes using gin (comestible);
create index if not exists idx_plantes_vie_sauvage  on plantes using gin (vie_sauvage);
create index if not exists idx_plantes_inconv       on plantes using gin (inconvenients);
create index if not exists idx_plantes_ph           on plantes (ph_min, ph_max);

create index if not exists idx_plantes_nom_fr_trgm  on plantes using gin (nom_francais gin_trgm_ops);
create index if not exists idx_plantes_nom_en_trgm  on plantes using gin (nom_anglais gin_trgm_ops);
create index if not exists idx_plantes_genre_trgm   on plantes using gin (genre gin_trgm_ops);

-- RLS : lecture publique, écriture réservée au service_role (utilisé côté serveur)
alter table plantes enable row level security;
alter table pepinieres enable row level security;
alter table plantes_pepinieres enable row level security;

create policy "lecture publique plantes"
    on plantes for select using (true);

create policy "lecture publique pepinieres"
    on pepinieres for select using (true);

create policy "lecture publique plantes_pepinieres"
    on plantes_pepinieres for select using (true);
