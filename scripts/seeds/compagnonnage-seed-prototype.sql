-- ============================================================
-- Amorce de compagnonnage — extraite du prototype JSX de juillet.
--
-- IMPORTANT : ce contenu a été rédigé par Claude dans une session de
-- prototypage créatif, PAS tiré d'une source botanique vérifiée (contrairement
-- au cas du noyer noir/juglone dans compagnonnage.sql, qui est un fait établi).
-- confiance = 'a_verifier' partout, volontairement — c'est un point de départ
-- pour savoir QUOI vérifier, pas une liste de faits à activer telle quelle.
--
-- Avant de faire confiance à une ligne pour de vrai (ex. la remonter dans le
-- scoring de genererPlanZone ou le générateur de guildes IA), vérifie-la contre
-- une vraie source (Edible Forest Gardens, les guides québécois déjà trouvés)
-- et passe sa confiance à 'etabli' ou 'observation' selon le cas.
--
-- Les slugs supposent la convention genre-espece en minuscules (cohérente avec
-- etl_plantes.py) — à ajuster si le catalogue Cowork utilise une autre convention.
-- Si un slug ne matche rien, la ligne insert échoue silencieusement (where ne
-- retourne rien) plutôt que de planter — vérifie après coup combien de lignes
-- ont vraiment été insérées.
-- ============================================================

-- Fonction utilitaire locale pour éviter de répéter le même bloc select 12 fois
create or replace function _inserer_compagnonnage_prototype(
    p_slug_a text, p_slug_b text, p_relation text, p_raison text
) returns void
language plpgsql
as $$
declare
    v_id_a bigint;
    v_id_b bigint;
    v_lo bigint;
    v_hi bigint;
begin
    select id into v_id_a from plantes where slug = p_slug_a;
    select id into v_id_b from plantes where slug = p_slug_b;

    if v_id_a is null or v_id_b is null then
        raise notice 'Ignoré : slug manquant (% ou %) — vérifie la convention de nommage réelle', p_slug_a, p_slug_b;
        return;
    end if;

    v_lo := least(v_id_a, v_id_b);
    v_hi := greatest(v_id_a, v_id_b);

    insert into compagnonnage (plante_a_id, plante_b_id, relation, raison, source, confiance)
    values (v_lo, v_hi, p_relation, p_raison, 'Prototype JSX juillet 2026 (contenu généré, non vérifié)', 'a_verifier')
    on conflict (plante_a_id, plante_b_id) do nothing;
end;
$$;

select _inserer_compagnonnage_prototype('alnus-incana', 'amelanchier-canadensis', 'benefique', 'Azote de l''aulne profite à l''amélanchier');
select _inserer_compagnonnage_prototype('amelanchier-canadensis', 'rubus-idaeus', 'benefique', 'Même niche temporelle, pollinisateurs partagés');
select _inserer_compagnonnage_prototype('amelanchier-canadensis', 'aronia-melanocarpa', 'benefique', 'Fruits complémentaires, même milieu');
select _inserer_compagnonnage_prototype('aronia-melanocarpa', 'amorpha-fruticosa', 'benefique', 'Fixateur d''azote qui stimule l''aronie');
select _inserer_compagnonnage_prototype('aronia-melanocarpa', 'acer-saccharum', 'neutre', 'Tolère l''ombre partielle sous l''érable');
select _inserer_compagnonnage_prototype('alnus-incana', 'acer-saccharum', 'benefique', 'Azote de l''aulne profite à l''érable');
select _inserer_compagnonnage_prototype('amelanchier-canadensis', 'acer-saccharum', 'benefique', 'S''installe bien en sous-étage de l''érable');
select _inserer_compagnonnage_prototype('acer-saccharum', 'rubus-idaeus', 'neutre', 'Le framboisier décline naturellement sous l''ombre de l''érable à maturité');
select _inserer_compagnonnage_prototype('rubus-idaeus', 'taraxacum-officinale', 'benefique', 'Le pissenlit minéralise le sol autour du framboisier');
select _inserer_compagnonnage_prototype('lonicera-caerulea', 'taraxacum-officinale', 'benefique', 'Apport minéral via la litière foliaire du pissenlit');
select _inserer_compagnonnage_prototype('alnus-incana', 'taraxacum-officinale', 'benefique', 'Association classique : azote (aulne) + minéraux remontés (pissenlit)');

drop function _inserer_compagnonnage_prototype(text, text, text, text);

-- Vérification à lancer après coup :
-- select count(*) from compagnonnage where source like 'Prototype JSX%';
-- (devrait être ≤ 11 — moins si des slugs ne matchent pas, voir les NOTICE ci-dessus)
