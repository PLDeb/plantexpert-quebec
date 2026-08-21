-- Restaure les index GIN/trgm supprimés par accident : une migration
-- antérieure (add_indigene_status) contenait des DROP INDEX générés
-- automatiquement par `prisma migrate dev --create-only` (parce que ces
-- index ne sont pas représentés dans schema.prisma, seulement ajoutés en
-- SQL brut) et a été appliquée avant d'être nettoyée. Recrée exactement
-- ce qui existait avant.
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
