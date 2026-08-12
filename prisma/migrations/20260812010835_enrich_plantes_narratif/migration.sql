-- AlterTable
ALTER TABLE "plantes" ADD COLUMN     "ecologie_notes" TEXT,
ADD COLUMN     "espacement_recommande_m" DECIMAL(4,1),
ADD COLUMN     "integration_design_notes" TEXT,
ADD COLUMN     "orientation_preferee" TEXT;

-- Documentation des nouvelles colonnes (enrichissement narratif progressif,
-- pas requis pour le fonctionnement du sélecteur)
comment on column plantes.ecologie_notes is 'Rédaction libre de la niche écologique — enrichissement progressif, pas requis pour le fonctionnement du sélecteur';
comment on column plantes.integration_design_notes is 'Conseils de placement/association en design — enrichissement progressif';
comment on column plantes.espacement_recommande_m is 'Distance de plantation recommandée entre individus, distincte de largeur_max_m (encombrement à maturité)';
comment on column plantes.orientation_preferee is 'Orientation cardinale préférée (N, S, S-E, S-O, N-O...) — vocabulaire libre, pas de contrainte enum';
