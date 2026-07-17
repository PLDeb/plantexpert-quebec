export interface TerrainProfile {
  profil: {
    prenom: string;
    experience_jardinage: "débutant" | "intermédiaire" | "avancé";
    objectif_principal: string;
    contexte: string;
  };
  localisation: {
    region: string;
    municipalite: string;
    zone_rusticite: string;
    exposition_generale: string;
  };
  terrain: {
    superficie_m2: number;
    topographie: "plat" | "légère pente" | "forte pente";
    sol_texture: "léger" | "moyen" | "lourd";
    sol_drainage: "bien drainé" | "moyen" | "mal drainé";
    ensoleillement: "plein soleil" | "mi-ombre" | "ombre";
    presence_eau: boolean;
    description_eau: string;
  };
  contraintes: {
    budget_estime: string;
    presence_animaux: boolean;
    type_animaux: string;
    delai_projet: string;
  };
  vision: {
    priorites: string[];
    especes_desirees: string[];
    especes_a_eviter: string[];
  };
  recommandations_preliminaires: {
    type_amenagement: string;
    guildes_suggerees: string[];
    points_attention: string[];
  };
}
