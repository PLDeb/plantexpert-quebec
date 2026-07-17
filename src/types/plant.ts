export type Forme = "Arbre" | "Arbuste" | "Herbacée";
export type Lumiere = "plein-soleil" | "mi-ombre" | "ombre";
export type Eau = "peu" | "moyen" | "beaucoup";

export type Strate =
  | "canopee-haute"
  | "canopee-basse"
  | "sous-canopee"
  | "arbustive-haute"
  | "arbustive-basse"
  | "couvre-sol";

export type RoleGuilde =
  | "arbre-central"
  | "canopee"
  | "fixateur-azote"
  | "petit-fruit"
  | "accumulateur"
  | "pollinisateur"
  | "couvre-sol"
  | "riveraine";

export interface Plant {
  id: number;
  prix: number;
  nom: string;
  latin: string;
  emoji: string;
  zoneMin: number;
  zone: string;
  indigene: boolean;
  forme: Forme;
  hauteur: [number, number];
  espacement: number;
  sol: string[];
  lumiere: Lumiere;
  eau: Eau;
  fonctions: string[];
  strate: Strate;
  roleGuilde: RoleGuilde;
  orientation_preferee: string;
  couleur: string;
  ecologie: string;
}

export interface StrateInfo {
  id: Strate;
  label: string;
  h: string;
  c: string;
}
