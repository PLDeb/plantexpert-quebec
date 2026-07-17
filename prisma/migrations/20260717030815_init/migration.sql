-- CreateTable
CREATE TABLE "terrain_profiles" (
    "id" TEXT NOT NULL,
    "parcours" TEXT NOT NULL,
    "region" TEXT,
    "zone_rusticite" TEXT,
    "superficie_m2" INTEGER,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terrain_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "prenom" TEXT,
    "parcours" TEXT,
    "terrain_profile_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_terrain_profile_id_fkey" FOREIGN KEY ("terrain_profile_id") REFERENCES "terrain_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
