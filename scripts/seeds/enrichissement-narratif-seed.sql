-- ============================================================
-- Enrichissement narratif — 8 espèces déjà rédigées dans le prototype
-- de juillet. Même réserve que compagnonnage-seed-prototype.sql : ce
-- texte a été écrit par Claude en session de prototypage créatif, pas
-- vérifié contre une source botanique. La barre de risque est plus basse
-- ici (du texte descriptif fait moins de dégât qu'une fausse règle de
-- compagnonnage si erroné), mais relis-le quand même avant publication
-- publique — en particulier les chiffres d'espacement.
--
-- Je ne mets à jour QUE les champs pour lesquels j'ai vraiment du contenu
-- retrouvé dans le prototype — pas de valeur inventée pour combler les trous
-- (ex: camérisier bleu n'a pas d'espacement/orientation retrouvés, laissés null).
-- Requiert enrichir-plantes.sql déjà appliqué.
-- ============================================================

update plantes set
    ecologie_notes = 'Espèce pionnière très rustique. Tolère les sols lourds et les sites exposés. Floraison très précoce (avril) — ressource essentielle pour les pollinisateurs au sortir de l''hiver.',
    integration_design_notes = 'Idéale en bordure de boisé ou en haie productive. Associer avec les aulnes pour enrichir l''azote. Peut occuper la strate arbustive basse sous des pommiers.'
where slug = 'lonicera-caerulea';

update plantes set
    ecologie_notes = 'Fixateur d''azote symbiotique. Colonise les sols pauvres et humides. Parfait en bande riveraine ou brise-vent.',
    espacement_recommande_m = 5,
    orientation_preferee = 'N-O'
where slug = 'alnus-incana';

update plantes set
    ecologie_notes = 'Première à fleurir au printemps. Fruits très appréciés des oiseaux et des humains. Très adaptable, résistante au sel de voirie.',
    integration_design_notes = 'Parfait en lisière, en transition forêt-prairie. Crée rapidement un milieu accueillant pour les oiseaux disperseurs de graines. Associer avec l''aulne et le camérisier.',
    espacement_recommande_m = 4,
    orientation_preferee = 'S-E'
where slug = 'amelanchier-canadensis';

update plantes set
    ecologie_notes = 'Supporte les sols pauvres et les conditions difficiles. Riche en antioxydants. Colonise rapidement via drageons. Excellent couvre-sol pour contrôler l''érosion sur les pentes.',
    integration_design_notes = 'Utiliser en masse pour créer des haies basses productives. Excellent en association sous les arbres fruitiers plus grands.',
    espacement_recommande_m = 1.5,
    orientation_preferee = 'S'
where slug = 'aronia-melanocarpa';

update plantes set
    ecologie_notes = 'Fixateur d''azote symbiotique. Très tolérant à la sécheresse une fois établi. Fleurs violet intense très mellifères. Racines profondes qui stabilisent les berges.',
    integration_design_notes = 'Utiliser comme arbuste fertilisant en milieu sec ou en transition pente/plaine. Ne pas surplanter — peut devenir envahissant dans les milieux humides ouverts.',
    espacement_recommande_m = 2,
    orientation_preferee = 'S-O'
where slug = 'amorpha-fruticosa';

update plantes set
    ecologie_notes = 'Espèce pionnière après perturbation. Les tiges mortes servent d''abris pour les insectes solitaires. Feuilles médicinales.',
    espacement_recommande_m = 1,
    orientation_preferee = 'S-E'
where slug = 'rubus-idaeus';

update plantes set
    ecologie_notes = 'Espèce dominante de la forêt décidue québécoise. Canopée riche, biodiversité élevée en sous-étage. Racines superficielles — sensible au compactage. Cycle synchronisé avec des centaines d''espèces.',
    integration_design_notes = 'Planter en canopée dominante (horizon 20+ ans). Gérer le pâturage sous les érables — les animaux compactent les racines. Conserver le bois mort debout pour la faune.',
    espacement_recommande_m = 10,
    orientation_preferee = 'N'
where slug = 'acer-saccharum';

update plantes set
    ecologie_notes = 'Accumulateur de nutriments par excellence via sa racine pivotante profonde. Minéralise le sol en remontant le calcium, le fer et le potassium. Première source de pollen au printemps.',
    integration_design_notes = 'Laisser en place dans les espaces entre arbustes. Sa racine ameublit les sols compacts. Couper avant la montée en graine pour limiter la dispersion si nécessaire.',
    espacement_recommande_m = 0.3,
    orientation_preferee = 'S'
where slug = 'taraxacum-officinale';

-- Vérification : combien de lignes ont vraiment matché (attendu: jusqu'à 8)
-- select slug, ecologie_notes is not null as a_du_contenu
-- from plantes
-- where slug in ('lonicera-caerulea','alnus-incana','amelanchier-canadensis',
--                'aronia-melanocarpa','amorpha-fruticosa','rubus-idaeus',
--                'acer-saccharum','taraxacum-officinale');
