export type ParcoursId = "debutant" | "intermediaire" | "expert";

export interface Parcours {
  id: ParcoursId;
  emoji: string;
  titre: string;
  niveau: string;
  sousTitre: string;
  desc: string;
  ctaTitre: string;
  ctaDesc: string;
  ctaBouton: string;
  ctaSecondaire: string[] | null;
  couleur: string;
}

export const PARCOURS: Record<ParcoursId, Parcours> = {
  debutant: {
    id: "debutant",
    emoji: "🌱",
    titre: "Guide-moi de A à Z",
    niveau: "Débutant",
    sousTitre: "Je découvre, accompagnez-moi",
    desc: "Vous voulez aménager mais ne savez pas par où commencer. Sylvie fait le diagnostic complet et vous propose un design clé en main.",
    ctaTitre: "Réserver mon accompagnement clé en main",
    ctaDesc:
      "Notre équipe s'occupe de tout : diagnostic, design, préparation du sol et plantation. Vous n'avez qu'à profiter du résultat.",
    ctaBouton: "📅 Réserver une rencontre",
    ctaSecondaire: null,
    couleur: "#6B9E7A",
  },
  intermediaire: {
    id: "intermediaire",
    emoji: "🌿",
    titre: "Aide-moi par bouts",
    niveau: "Intermédiaire",
    sousTitre: "J'ai des bases, je veux du soutien ciblé",
    desc: "Vous êtes à l'aise mais aimeriez de l'aide sur certaines étapes. Diagnostic + design, puis choisissez les services dont vous avez besoin.",
    ctaTitre: "Choisir mes services à la carte",
    ctaDesc: "Prenez seulement ce dont vous avez besoin :",
    ctaBouton: "🛠️ Voir les services à la carte",
    ctaSecondaire: [
      "Rencontre-conseil (1h)",
      "Plan de design détaillé",
      "Service de plantation",
    ],
    couleur: "#4A7A5A",
  },
  expert: {
    id: "expert",
    emoji: "🌳",
    titre: "Je fais tout moi-même",
    niveau: "Expert",
    sousTitre: "Donnez-moi juste ce qu'il me faut",
    desc: "Vous maîtrisez le sujet. On va droit au but : décrivez votre terrain, recevez la liste précise des végétaux avec quantités.",
    ctaTitre: "Commander mes végétaux",
    ctaDesc:
      "Votre liste est prête. Commandez directement vos végétaux ou obtenez un devis pépinière.",
    ctaBouton: "🛒 Commander mes végétaux",
    ctaSecondaire: null,
    couleur: "#2D5A3D",
  },
};

export const PARCOURS_LIST: Parcours[] = [
  PARCOURS.debutant,
  PARCOURS.intermediaire,
  PARCOURS.expert,
];
