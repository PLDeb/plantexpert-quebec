-- DropIndex
DROP INDEX "idx_plantes_comestible";

-- DropIndex
DROP INDEX "idx_plantes_eau";

-- DropIndex
DROP INDEX "idx_plantes_genre_trgm";

-- DropIndex
DROP INDEX "idx_plantes_inconv";

-- DropIndex
DROP INDEX "idx_plantes_lumiere";

-- DropIndex
DROP INDEX "idx_plantes_nom_en_trgm";

-- DropIndex
DROP INDEX "idx_plantes_nom_fr_trgm";

-- DropIndex
DROP INDEX "idx_plantes_ph";

-- DropIndex
DROP INDEX "idx_plantes_texture";

-- DropIndex
DROP INDEX "idx_plantes_vie_sauvage";

-- AlterTable
ALTER TABLE "plantes" ADD COLUMN     "indigene" BOOLEAN,
ADD COLUMN     "indigene_source" TEXT;
