-- ============================================================
-- Enrichissement de la banque de référence — champs présents dans
-- le prototype de juillet mais absents du schéma actuel (qui vient
-- du décodage structuré du sheet, pas de rédaction narrative).
--
-- Tous nullable : rien ne casse sur les 283 espèces existantes,
-- ces champs se remplissent progressivement, espèce par espèce.
-- ============================================================

alter table plantes add column if not exists ecologie_notes text;
-- Description de la niche écologique en langage courant — ce que la plante
-- "fait" dans un écosystème, au-delà des attributs codés (zone/sol/ph).
-- ex: "Fixateur d'azote symbiotique. Colonise les sols pauvres et humides."

alter table plantes add column if not exists integration_design_notes text;
-- Comment intégrer la plante dans un aménagement concret — conseils de
-- placement, associations à privilégier, pièges à éviter.
-- ex: "Utiliser en masse pour créer des haies basses productives."

alter table plantes add column if not exists espacement_recommande_m numeric(4,1);
-- Distance de plantation recommandée entre individus de cette espèce,
-- distincte de largeur_max_m (qui décrit l'encombrement à maturité) —
-- l'espacement de plantation est parfois plus serré si l'espèce est
-- destinée à former une masse (haie, couvre-sol).

alter table plantes add column if not exists orientation_preferee text;
-- check souple plutôt que enum strict, le vocabulaire d'orientation peut
-- varier (N, S-E, N-O...) sans qu'une contrainte rigide ajoute de valeur ici
-- ex: 'N', 'S', 'S-E', 'S-O', 'N-O'

comment on column plantes.ecologie_notes is 'Rédaction libre de la niche écologique — enrichissement progressif, pas requis pour le fonctionnement du sélecteur';
comment on column plantes.integration_design_notes is 'Conseils de placement/association en design — enrichissement progressif';
