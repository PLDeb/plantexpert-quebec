-- CreateTable
CREATE TABLE "compagnonnage" (
    "id" BIGSERIAL NOT NULL,
    "plante_a_id" BIGINT NOT NULL,
    "plante_b_id" BIGINT NOT NULL,
    "relation" TEXT NOT NULL,
    "raison" TEXT,
    "source" TEXT,
    "confiance" TEXT NOT NULL DEFAULT 'a_verifier',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compagnonnage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "compagnonnage_plante_a_id_idx" ON "compagnonnage"("plante_a_id");

-- CreateIndex
CREATE INDEX "compagnonnage_plante_b_id_idx" ON "compagnonnage"("plante_b_id");

-- CreateIndex
CREATE UNIQUE INDEX "compagnonnage_plante_a_id_plante_b_id_key" ON "compagnonnage"("plante_a_id", "plante_b_id");

-- AddForeignKey
ALTER TABLE "compagnonnage" ADD CONSTRAINT "compagnonnage_plante_a_id_fkey" FOREIGN KEY ("plante_a_id") REFERENCES "plantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compagnonnage" ADD CONSTRAINT "compagnonnage_plante_b_id_fkey" FOREIGN KEY ("plante_b_id") REFERENCES "plantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- Ajouts SQL bruts (non exprimables par le schéma Prisma) :
-- contraintes CHECK, RLS.
-- ============================================================

alter table compagnonnage
    add constraint compagnonnage_relation_check
        check (relation in ('benefique', 'antagoniste', 'neutre')),
    add constraint compagnonnage_confiance_check
        check (confiance in ('etabli', 'observation', 'a_verifier')),
    add constraint paire_ordonnee
        check (plante_a_id < plante_b_id);

alter table compagnonnage enable row level security;

create policy "lecture publique compagnonnage"
    on compagnonnage for select using (true);
