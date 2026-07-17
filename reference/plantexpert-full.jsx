import { useState, useRef, useEffect } from "react";

var COLORS = {
  forest: "#1A3A2A", moss: "#2D5A3D", sage: "#4A7A5A", fern: "#6B9E7A",
  mist: "#B5C9BB", cream: "#F7F4EE", sand: "#EDE8DE", bark: "#8B6B4A",
  charcoal: "#2C2C2C", slate: "#5A5A5A", white: "#FFFFFF",
  accent: "#C4842A", danger: "#C0392B",
};

var PLANTS = [
  { id:1, prix:55, nom:"Pommier", latin:"Malus domestica", emoji:"🍎", zoneMin:3, zone:"3", indigene:false, forme:"Arbre", hauteur:[3,5], espacement:5, sol:["moyen","lourd"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Comestible","Nourriture faune","Pollinisateurs"], strate:"sous-canopee", roleGuilde:"arbre-central", orientation_preferee:"S", couleur:"#C0392B", ecologie:"Arbre fruitier central classique des guildes de permaculture. Nécessite un pollinisateur compatible à proximité. Excellente structure d'accueil pour un sous-étage productif." },
  { id:2, prix:58, nom:"Poirier", latin:"Pyrus communis", emoji:"🍐", zoneMin:4, zone:"4", indigene:false, forme:"Arbre", hauteur:[4,6], espacement:5, sol:["moyen","lourd"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Comestible","Nourriture faune","Pollinisateurs"], strate:"sous-canopee", roleGuilde:"arbre-central", orientation_preferee:"S", couleur:"#B5A642", ecologie:"Fruitier robuste et longévif. Plus tolérant aux sols lourds que le pommier. Floraison précoce, bon pour les pollinisateurs." },
  { id:3, prix:52, nom:"Prunier", latin:"Prunus domestica", emoji:"🟣", zoneMin:4, zone:"4", indigene:false, forme:"Arbre", hauteur:[3,5], espacement:4, sol:["moyen"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Comestible","Nourriture faune","Pollinisateurs"], strate:"sous-canopee", roleGuilde:"arbre-central", orientation_preferee:"S", couleur:"#6B3A5A", ecologie:"Fruitier productif à floraison hâtive. Attire abondamment les pollinisateurs au printemps. Certaines variétés autofertiles." },
  { id:4, prix:48, nom:"Cerisier", latin:"Prunus cerasus", emoji:"🍒", zoneMin:3, zone:"3", indigene:false, forme:"Arbre", hauteur:[3,5], espacement:4, sol:["léger","moyen"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Comestible","Nourriture faune","Pollinisateurs","Ornemental"], strate:"sous-canopee", roleGuilde:"arbre-central", orientation_preferee:"S", couleur:"#D4526E", ecologie:"Cerisier acidulé rustique (griotte). Résistant au froid, floraison ornementale spectaculaire. Fruits appréciés des oiseaux." },
  { id:5, prix:42, nom:"Argousier", latin:"Hippophae rhamnoides", emoji:"🧡", zoneMin:2, zone:"2", indigene:false, forme:"Arbuste", hauteur:[2,4], espacement:2.5, sol:["léger","moyen"], lumiere:"plein-soleil", eau:"peu", fonctions:["Comestible","Fixateur d'azote","Brise-vent"], strate:"arbustive-haute", roleGuilde:"fixateur-azote", orientation_preferee:"S-O", couleur:"#E67E22", ecologie:"Rare fruitier fixateur d'azote ! Baies très riches en vitamine C. Extrêmement rustique et tolérant à la sécheresse. Plantes mâles et femelles nécessaires." },
  { id:6, prix:18, nom:"Camérisier bleu", latin:"Lonicera caerulea", emoji:"🫐", zoneMin:2, zone:"2", indigene:true, forme:"Arbuste", hauteur:[1,2], espacement:2, sol:["léger","moyen","lourd"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Comestible","Nourriture faune","Pollinisateurs"], strate:"arbustive-basse", roleGuilde:"petit-fruit", orientation_preferee:"S-E", couleur:"#4A90A4", ecologie:"Floraison très précoce (avril), essentielle pour les pollinisateurs au sortir de l'hiver. Très rustique." },
  { id:7, prix:35, nom:"Amélanchier du Canada", latin:"Amelanchier canadensis", emoji:"🌸", zoneMin:3, zone:"3", indigene:true, forme:"Arbre", hauteur:[4,6], espacement:4, sol:["léger","moyen","lourd"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Comestible","Nourriture faune","Ornemental","Bande riveraine"], strate:"sous-canopee", roleGuilde:"petit-fruit", orientation_preferee:"S-E", couleur:"#E8A87C", ecologie:"Première à fleurir au printemps. Fruits (petites poires) très appréciés des oiseaux et des humains. Indigène adaptable." },
  { id:8, prix:16, nom:"Aronie noire", latin:"Aronia melanocarpa", emoji:"🫒", zoneMin:3, zone:"3", indigene:true, forme:"Arbuste", hauteur:[1,1.5], espacement:1.5, sol:["léger","moyen","lourd"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Comestible","Nourriture faune","Couvre-sol"], strate:"arbustive-basse", roleGuilde:"petit-fruit", orientation_preferee:"S", couleur:"#6B3A5A", ecologie:"Indigène supportant les sols pauvres. Baies très riches en antioxydants. Excellent sur les pentes." },
  { id:9, prix:8, nom:"Framboisier", latin:"Rubus idaeus", emoji:"🍓", zoneMin:2, zone:"2", indigene:true, forme:"Arbuste", hauteur:[1,2], espacement:1, sol:["léger","moyen"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Comestible","Nourriture faune","Couvre-sol"], strate:"arbustive-basse", roleGuilde:"petit-fruit", orientation_preferee:"S-E", couleur:"#D4526E", ecologie:"Espèce pionnière indigène. Les tiges mortes abritent les insectes solitaires. Feuilles médicinales." },
  { id:10, prix:20, nom:"Sureau du Canada", latin:"Sambucus canadensis", emoji:"🍇", zoneMin:3, zone:"3", indigene:true, forme:"Arbuste", hauteur:[2,4], espacement:3, sol:["moyen","lourd"], lumiere:"plein-soleil", eau:"beaucoup", fonctions:["Comestible","Nourriture faune","Médicinal","Pollinisateurs"], strate:"arbustive-haute", roleGuilde:"petit-fruit", orientation_preferee:"N-E", couleur:"#8E44AD", ecologie:"Indigène très productif en milieux humides. Fleurs et fruits comestibles et médicinaux. Aimant à oiseaux." },
  { id:11, prix:12, nom:"Aulne rugueux", latin:"Alnus incana", emoji:"🌿", zoneMin:2, zone:"2b", indigene:true, forme:"Arbre", hauteur:[8,15], espacement:5, sol:["moyen","lourd"], lumiere:"plein-soleil", eau:"beaucoup", fonctions:["Fixateur d'azote","Brise-vent","Bande riveraine","Abri faune"], strate:"canopee-basse", roleGuilde:"fixateur-azote", orientation_preferee:"N-O", couleur:"#7BA05B", ecologie:"Fixateur d'azote symbiotique indigène. Colonise les sols pauvres et humides. Parfait en bande riveraine ou brise-vent." },
  { id:12, prix:14, nom:"Faux indigo", latin:"Amorpha fruticosa", emoji:"💜", zoneMin:4, zone:"3b", indigene:false, forme:"Arbuste", hauteur:[2,3], espacement:2, sol:["léger","moyen","lourd"], lumiere:"plein-soleil", eau:"peu", fonctions:["Fixateur d'azote","Pollinisateurs","Bande riveraine"], strate:"arbustive-haute", roleGuilde:"fixateur-azote", orientation_preferee:"S-O", couleur:"#5B4A8B", ecologie:"Fixateur d'azote tolérant à la sécheresse. Fleurs violet très mellifères." },
  { id:13, prix:16, nom:"Myrique baumier", latin:"Myrica gale", emoji:"🌾", zoneMin:2, zone:"2", indigene:true, forme:"Arbuste", hauteur:[0.5,1.5], espacement:1.5, sol:["moyen","lourd"], lumiere:"plein-soleil", eau:"beaucoup", fonctions:["Fixateur d'azote","Bande riveraine","Médicinal"], strate:"arbustive-basse", roleGuilde:"fixateur-azote", orientation_preferee:"N-E", couleur:"#5D8A66", ecologie:"Petit arbuste indigène fixateur d'azote des milieux humides. Feuillage aromatique. Idéal en bordure de zone mouillée." },
  { id:14, prix:45, nom:"Érable à sucre", latin:"Acer saccharum", emoji:"🍁", zoneMin:4, zone:"3b", indigene:true, forme:"Arbre", hauteur:[15,20], espacement:10, sol:["moyen"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Acéricole","Abri faune","Coupe-vent"], strate:"canopee-haute", roleGuilde:"canopee", orientation_preferee:"N", couleur:"#C0392B", ecologie:"Espèce dominante de la forêt décidue québécoise. Canopée riche, biodiversité élevée. Acériculture." },
  { id:15, prix:25, nom:"Peuplier faux-tremble", latin:"Populus tremuloides", emoji:"🌳", zoneMin:1, zone:"1", indigene:true, forme:"Arbre", hauteur:[10,20], espacement:6, sol:["léger","moyen"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Abri faune","Brise-vent","Coupe-vent"], strate:"canopee-haute", roleGuilde:"canopee", orientation_preferee:"N-O", couleur:"#BDC3C7", ecologie:"Espèce pionnière indigène très rapide. Crée un microclimat protecteur rapidement." },
  { id:16, prix:3, nom:"Consoude", latin:"Symphytum officinale", emoji:"🌿", zoneMin:3, zone:"3", indigene:false, forme:"Herbacée", hauteur:[0.6,1.2], espacement:0.6, sol:["moyen","lourd"], lumiere:"mi-ombre", eau:"moyen", fonctions:["Accumulateur de nutriments","Pollinisateurs","Médicinal"], strate:"couvre-sol", roleGuilde:"accumulateur", orientation_preferee:"S", couleur:"#8E44AD", ecologie:"Accumulateur de nutriments par excellence. Racine pivotante profonde qui remonte le potassium. Feuilles utilisées comme engrais vert (paillis)." },
  { id:17, prix:3, nom:"Pissenlit", latin:"Taraxacum officinale", emoji:"🌼", zoneMin:1, zone:"1", indigene:false, forme:"Herbacée", hauteur:[0.1,0.4], espacement:0.3, sol:["léger","moyen","lourd"], lumiere:"plein-soleil", eau:"peu", fonctions:["Accumulateur de nutriments","Pollinisateurs","Comestible","Médicinal"], strate:"couvre-sol", roleGuilde:"accumulateur", orientation_preferee:"S", couleur:"#F39C12", ecologie:"Accumulateur de nutriments via sa racine pivotante. Première source de pollen printanier." },
  { id:18, prix:10, nom:"Raisin d'ours", latin:"Arctostaphylos uva-ursi", emoji:"🔴", zoneMin:2, zone:"2", indigene:true, forme:"Arbuste", hauteur:[0.1,0.2], espacement:1, sol:["léger"], lumiere:"plein-soleil", eau:"peu", fonctions:["Couvre-sol","Nourriture faune","Médicinal"], strate:"couvre-sol", roleGuilde:"couvre-sol", orientation_preferee:"S", couleur:"#922B21", ecologie:"Couvre-sol persistant indigène pour sols légers acides et sites secs. Contrôle l'érosion sur pente sèche." },
  { id:19, prix:6, nom:"Fraisier des champs", latin:"Fragaria virginiana", emoji:"🍓", zoneMin:2, zone:"2", indigene:true, forme:"Herbacée", hauteur:[0.1,0.2], espacement:0.3, sol:["léger","moyen"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Comestible","Couvre-sol","Nourriture faune","Pollinisateurs"], strate:"couvre-sol", roleGuilde:"couvre-sol", orientation_preferee:"S", couleur:"#E74C3C", ecologie:"Fraise sauvage indigène, couvre-sol comestible parfait sous les fruitiers. Stolons colonisateurs, petits fruits savoureux." },
  { id:20, prix:8, nom:"Monarde fistuleuse", latin:"Monarda fistulosa", emoji:"🌸", zoneMin:3, zone:"3", indigene:true, forme:"Herbacée", hauteur:[0.6,1.2], espacement:0.4, sol:["léger","moyen"], lumiere:"plein-soleil", eau:"moyen", fonctions:["Pollinisateurs","Médicinal","Ornemental"], strate:"couvre-sol", roleGuilde:"pollinisateur", orientation_preferee:"S", couleur:"#9B59B6", ecologie:"Indigène aimant à pollinisateurs et papillons. Feuillage aromatique médicinal (thé). Fleurs mauves spectaculaires." },
  { id:21, prix:15, nom:"Cornouiller stolonifère", latin:"Cornus sericea", emoji:"🌾", zoneMin:2, zone:"2", indigene:true, forme:"Arbuste", hauteur:[1.5,3], espacement:2, sol:["moyen","lourd"], lumiere:"plein-soleil", eau:"beaucoup", fonctions:["Bande riveraine","Nourriture faune","Ornemental"], strate:"arbustive-haute", roleGuilde:"riveraine", orientation_preferee:"N-E", couleur:"#E74C3C", ecologie:"Excellente espèce riveraine indigène. Tiges rouges ornementales en hiver. Stabilisation des berges." },
];

var FN_COLORS = {
  "Fixateur d'azote":"#27AE60","Accumulateur de nutriments":"#8E44AD","Comestible":"#E67E22",
  "Nourriture faune":"#2980B9","Pollinisateurs":"#F39C12","Brise-vent":"#95A5A6",
  "Bande riveraine":"#1ABC9C","Couvre-sol":"#7F8C8D","Ornemental":"#E91E63",
  "Médicinal":"#9B59B6","Abri faune":"#3498DB","Acéricole":"#D35400","Coupe-vent":"#BDC3C7",
};

var STRATES = [
  {id:"canopee-haute",  label:"Canopée haute",   h:"10–25m", c:"#1A3A2A"},
  {id:"canopee-basse",  label:"Canopée basse",   h:"5–10m",  c:"#2D5A3D"},
  {id:"sous-canopee",   label:"Sous-canopée",    h:"3–6m",   c:"#4A7A5A"},
  {id:"arbustive-haute",label:"Arbustive haute", h:"2–4m",   c:"#6B9E7A"},
  {id:"arbustive-basse",label:"Arbustive basse", h:"0.5–2m", c:"#8B6B4A"},
  {id:"couvre-sol",     label:"Couvre-sol",      h:"0–0.5m", c:"#B5C9BB"},
];

// ─── GUILDES-MODÈLES (recettes éprouvées) ──────────────────────────────────
// axe : "arbre-central" | "objectif" | "milieu"
// zoneMin : zone de rusticité minimale requise
// roles : rôles à remplir dans la guilde (l'IA choisit les espèces adaptées)
var GUILD_TEMPLATES = [
  {
    id: "guilde-pommier",
    nom: "Guilde du pommier",
    axe: "arbre-central",
    emoji: "🍎",
    zoneMin: 3,
    objectifs: ["Comestible", "Production fruitière"],
    milieux: ["sol moyen", "plein soleil"],
    desc: "Un pommier ou poirier central entouré de plantes qui le nourrissent, attirent ses pollinisateurs et repoussent ses ravageurs. La guilde fruitière classique de permaculture.",
    roles: ["arbre-central", "fixateur-azote", "accumulateur", "pollinisateur", "couvre-sol"],
    couleur: "#C0392B",
  },
  {
    id: "haie-brise-vent",
    nom: "Haie brise-vent nourricière",
    axe: "objectif",
    emoji: "🌬️",
    zoneMin: 2,
    objectifs: ["Brise-vent", "Nourriture faune", "Biodiversité"],
    milieux: ["sites exposés", "bordure"],
    desc: "Une haie étagée qui coupe le vent tout en produisant fruits et abris pour la faune. Combine grands arbustes robustes et fixateurs d'azote.",
    roles: ["canopee", "fixateur-azote", "petit-fruit", "petit-fruit"],
    couleur: "#4A7A5A",
  },
  {
    id: "coin-pollinisateurs",
    nom: "Coin des pollinisateurs",
    axe: "objectif",
    emoji: "🐝",
    zoneMin: 2,
    objectifs: ["Pollinisateurs", "Biodiversité", "Ornemental"],
    milieux: ["plein soleil"],
    desc: "Un massif de plantes mellifères à floraisons échelonnées pour soutenir abeilles et papillons de mai à septembre. Attire les pollinisateurs vers tout l'aménagement.",
    roles: ["petit-fruit", "pollinisateur", "pollinisateur", "accumulateur"],
    couleur: "#F39C12",
  },
  {
    id: "bande-riveraine",
    nom: "Bande riveraine productive",
    axe: "milieu",
    emoji: "💧",
    zoneMin: 2,
    objectifs: ["Bande riveraine", "Stabilisation", "Nourriture faune"],
    milieux: ["sol humide", "bord de l'eau", "mal drainé"],
    desc: "Pour les zones humides ou en bordure de cours d'eau : stabilise les berges, filtre l'eau et produit des fruits, avec des espèces indigènes qui aiment avoir les pieds mouillés.",
    roles: ["fixateur-azote", "riveraine", "petit-fruit", "couvre-sol"],
    couleur: "#1ABC9C",
  },
  {
    id: "verger-sec",
    nom: "Verger de terrain sec",
    axe: "milieu",
    emoji: "☀️",
    zoneMin: 2,
    objectifs: ["Comestible", "Résistance sécheresse"],
    milieux: ["sol léger", "sec", "pente sud"],
    desc: "Pour les sols légers et secs exposés au soleil : des espèces tolérantes à la sécheresse comme l'argousier, avec un couvre-sol qui retient l'humidité.",
    roles: ["arbre-central", "fixateur-azote", "couvre-sol", "accumulateur"],
    couleur: "#E67E22",
  },
];

var ROLE_LABELS = {
  "arbre-central": "Arbre central",
  "canopee": "Canopée / structure",
  "fixateur-azote": "Fixateur d'azote",
  "petit-fruit": "Petit fruit",
  "accumulateur": "Accumulateur de nutriments",
  "pollinisateur": "Pollinisateur",
  "couvre-sol": "Couvre-sol",
  "riveraine": "Espèce riveraine",
};

// Convertit une chaîne de zone ("3b", "4", "3d") en nombre pour comparaison
function zoneToNumber(zoneStr) {
  if (!zoneStr) return 3;
  var m = String(zoneStr).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 3;
}

// Filtre les plantes selon la zone du client (zoneMin de la plante <= zone client)
function plantsForZone(clientZone) {
  var z = zoneToNumber(clientZone);
  return PLANTS.filter(function(p) { return p.zoneMin <= z; });
}

// Filtre les guildes-modèles disponibles pour une zone
function templatesForZone(clientZone) {
  var z = zoneToNumber(clientZone);
  return GUILD_TEMPLATES.filter(function(t) { return t.zoneMin <= z; });
}

var PHASES = [
  {label:"Profil",      color:"#6B9E7A"},
  {label:"Lieu",        color:"#4A7A5A"},
  {label:"Terrain",     color:"#2D5A3D"},
  {label:"Contraintes", color:"#8B6B4A"},
  {label:"Vision",      color:"#C4842A"},
];

var PARCOURS = {
  debutant: {
    id: "debutant",
    emoji: "🌱",
    titre: "Guide-moi de A à Z",
    niveau: "Débutant",
    sousTitre: "Je découvre, accompagnez-moi",
    desc: "Vous voulez aménager mais ne savez pas par où commencer. Sylvie fait le diagnostic complet et vous propose un design clé en main.",
    ctaTitre: "Réserver mon accompagnement clé en main",
    ctaDesc: "Notre équipe s'occupe de tout : diagnostic, design, préparation du sol et plantation. Vous n'avez qu'à profiter du résultat.",
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
    ctaSecondaire: ["Rencontre-conseil (1h)", "Plan de design détaillé", "Service de plantation"],
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
    ctaDesc: "Votre liste est prête. Commandez directement vos végétaux ou obtenez un devis pépinière.",
    ctaBouton: "🛒 Commander mes végétaux",
    ctaSecondaire: null,
    couleur: "#2D5A3D",
  },
};

var QUICK_REPLIES = [
  ["Chaudière-Appalaches","Québec (ville)","Montérégie"],
  ["Moins de 200m²","200–500m²","500–1000m²","Plus de 1000m²"],
  ["Plein soleil","Mi-ombre","Ombre"],
  ["Aucun animal","Chiens","Poules"],
  ["Comestible","Biodiversité","Esthétique","Tout ça!"],
];

var AGENT_SYSTEM_FULL = "Tu es Sylvie, conseillère en aménagement écologique pour une entreprise québécoise spécialisée en permaculture et agroforesterie en Chaudière-Appalaches.\n\nTu mènes un diagnostic de terrain conversationnel en français québécois chaleureux. Ton rôle : collecter les informations pour une analyse complète et une guilde végétale sur-mesure.\n\nPHASES (dans l'ordre) :\n1. PROFIL — objectifs, contexte (le niveau d'expérience est déjà connu, ne le redemande pas)\n2. LOCALISATION — municipalité/région, zone de rusticité\n3. TERRAIN — sol, drainage, superficie, topographie, eau, ensoleillement\n4. CONTRAINTES — budget, animaux, accès, délais\n5. VISION — priorités, espèces désirées/à éviter\n\nRÈGLES :\n- UNE seule question à la fois\n- Ton chaleureux et accessible\n- Résumé rapide après chaque phase\n- Quand les 5 phases sont complètes, génère le JSON entre balises\n\n<SYNTHESE_JSON>\n{\n  \"profil\": {\"prenom\":\"\",\"experience_jardinage\":\"débutant|intermédiaire|avancé\",\"objectif_principal\":\"\",\"contexte\":\"\"},\n  \"localisation\": {\"region\":\"\",\"municipalite\":\"\",\"zone_rusticite\":\"\",\"exposition_generale\":\"\"},\n  \"terrain\": {\"superficie_m2\":0,\"topographie\":\"plat|légère pente|forte pente\",\"sol_texture\":\"léger|moyen|lourd\",\"sol_drainage\":\"bien drainé|moyen|mal drainé\",\"ensoleillement\":\"plein soleil|mi-ombre|ombre\",\"presence_eau\":false,\"description_eau\":\"\"},\n  \"contraintes\": {\"budget_estime\":\"\",\"presence_animaux\":false,\"type_animaux\":\"\",\"delai_projet\":\"\"},\n  \"vision\": {\"priorites\":[],\"especes_desirees\":[],\"especes_a_eviter\":[]},\n  \"recommandations_preliminaires\": {\"type_amenagement\":\"\",\"guildes_suggerees\":[],\"points_attention\":[]}\n}\n</SYNTHESE_JSON>\n\nCommence par te présenter et poser ta première question.";

var AGENT_SYSTEM_EXPRESS = "Tu es Sylvie, conseillère en aménagement écologique pour une entreprise québécoise spécialisée en permaculture en Chaudière-Appalaches.\n\nL'utilisateur est un jardinier EXPERT qui veut faire le travail lui-même. Il veut juste la liste précise des végétaux adaptés à son terrain. Va DROIT AU BUT — pas de pédagogie, ton efficace de pair à pair.\n\nCollecte rapidement (2-3 questions max, groupe-les) :\n- Localisation + zone de rusticité\n- Conditions du terrain : sol, drainage, ensoleillement, superficie, eau\n- Objectifs de production et espèces désirées/à éviter\n\nDès que tu as l'essentiel, génère le JSON. Ne t'attarde pas sur le budget ou l'accompagnement.\n\n<SYNTHESE_JSON>\n{\n  \"profil\": {\"prenom\":\"\",\"experience_jardinage\":\"avancé\",\"objectif_principal\":\"\",\"contexte\":\"\"},\n  \"localisation\": {\"region\":\"\",\"municipalite\":\"\",\"zone_rusticite\":\"\",\"exposition_generale\":\"\"},\n  \"terrain\": {\"superficie_m2\":0,\"topographie\":\"plat|légère pente|forte pente\",\"sol_texture\":\"léger|moyen|lourd\",\"sol_drainage\":\"bien drainé|moyen|mal drainé\",\"ensoleillement\":\"plein soleil|mi-ombre|ombre\",\"presence_eau\":false,\"description_eau\":\"\"},\n  \"contraintes\": {\"budget_estime\":\"\",\"presence_animaux\":false,\"type_animaux\":\"\",\"delai_projet\":\"\"},\n  \"vision\": {\"priorites\":[],\"especes_desirees\":[],\"especes_a_eviter\":[]},\n  \"recommandations_preliminaires\": {\"type_amenagement\":\"\",\"guildes_suggerees\":[],\"points_attention\":[]}\n}\n</SYNTHESE_JSON>\n\nCommence directement — présente-toi en une phrase et pose ta première question groupée sur la localisation et le terrain.";

function systemForParcours(parcoursId) {
  var base = parcoursId === "expert" ? AGENT_SYSTEM_EXPRESS : AGENT_SYSTEM_FULL;
  var niveau = parcoursId === "expert" ? "avancé" : parcoursId === "intermediaire" ? "intermédiaire" : "débutant";
  return base + "\n\nNOTE : le niveau d'expérience de l'utilisateur est \"" + niveau + "\". Adapte ton ton en conséquence.";
}

function callClaude(messages, system, onSuccess, onError) {
  var body = {
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: messages,
  };
  if (system) body.system = system;

  fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  .then(function(response) {
    if (!response.ok) {
      return response.text().then(function(errText) {
        throw new Error("HTTP " + response.status + " : " + errText.substring(0, 200));
      });
    }
    return response.json();
  })
  .then(function(data) {
    if (data.error) {
      onError("API : " + (data.error.message || JSON.stringify(data.error)).substring(0, 200));
      return;
    }
    var text = "";
    if (data.content) {
      for (var ci = 0; ci < data.content.length; ci++) {
        if (data.content[ci].type === "text") text += data.content[ci].text;
      }
    }
    if (!text) { onError("Réponse vide de l'API"); return; }
    onSuccess(text);
  })
  .catch(function(err) {
    onError((err && err.message ? err.message : String(err)).substring(0, 250));
  });
}

function extractJSON(text) {
  var match = text.match(/<SYNTHESE_JSON>([\s\S]*?)<\/SYNTHESE_JSON>/);
  if (!match) return null;
  try { return JSON.parse(match[1].trim()); } catch(e) { return null; }
}

function stripJSON(text) {
  return text.replace(/<SYNTHESE_JSON>[\s\S]*?<\/SYNTHESE_JSON>/g, "").trim();
}

function getPhase(msgs) {
  var n = msgs.filter(function(m) { return m.role === "assistant"; }).length;
  if (n <= 2) return 0;
  if (n <= 5) return 1;
  if (n <= 9) return 2;
  if (n <= 12) return 3;
  return 4;
}

function timeNow() {
  return new Date().toLocaleTimeString("fr-CA", {hour:"2-digit",minute:"2-digit"});
}

function plantByName(name) {
  for (var i = 0; i < PLANTS.length; i++) {
    if (PLANTS[i].nom === name) return PLANTS[i];
  }
  return null;
}

function plantSummaryForZone(clientZone) {
  var avail = plantsForZone(clientZone);
  var list = [];
  for (var i = 0; i < avail.length; i++) {
    list.push({
      nom: avail[i].nom, strate: avail[i].strate, role: avail[i].roleGuilde,
      fonctions: avail[i].fonctions, sol: avail[i].sol,
      lumiere: avail[i].lumiere, eau: avail[i].eau,
      zoneMin: avail[i].zoneMin, indigene: avail[i].indigene,
      hauteur: avail[i].hauteur, espacement: avail[i].espacement,
      orientation_preferee: avail[i].orientation_preferee
    });
  }
  return list;
}

// Prompt pour RECOMMANDER 2-3 guildes-modèles adaptées au terrain
function buildRecommendPrompt(terrain, superficie) {
  var clientZone = terrain && terrain.localisation ? terrain.localisation.zone_rusticite : "3";
  var templates = templatesForZone(clientZone).map(function(t) {
    return { id: t.id, nom: t.nom, axe: t.axe, objectifs: t.objectifs, milieux: t.milieux, desc: t.desc };
  });
  return "Tu es expert en design de permaculture québécoise. Un client a un terrain et tu dois recommander quelles GUILDES-MODÈLES combiner sur son terrain.\n\n" +
    "TERRAIN:\n" + JSON.stringify(terrain, null, 2) + "\nSuperficie: " + superficie + "m²\n\n" +
    "GUILDES-MODÈLES DISPONIBLES (compatibles avec sa zone):\n" + JSON.stringify(templates, null, 2) + "\n\n" +
    "Recommande de 1 à 3 guildes qui se COMBINENT bien pour ce terrain (selon superficie, sol, eau, objectifs). " +
    "Plus le terrain est grand, plus tu peux en proposer. Un petit terrain (<300m²) = 1 guilde. Réponds en JSON valide UNIQUEMENT (sans backtick):\n" +
    '{"recommandations":[{"template_id":"","raison":"Pourquoi cette guilde pour ce terrain","superficie_allouee_m2":0}],"logique_ensemble":"Comment les guildes se répartissent et se complètent sur le terrain"}';
}

// Prompt pour GÉNÉRER une guilde à partir d'un modèle, adaptée au terrain
function buildGuildPrompt(terrain, superficie, template) {
  var clientZone = terrain && terrain.localisation ? terrain.localisation.zone_rusticite : "3";
  var plantList = plantSummaryForZone(clientZone);

  var templateSection = "";
  if (template) {
    templateSection = "GUILDE-MODÈLE À ADAPTER:\n" + JSON.stringify({
      nom: template.nom, desc: template.desc, roles: template.roles, objectifs: template.objectifs
    }, null, 2) + "\n\nPars de ce modèle et remplis chaque rôle avec l'espèce la MIEUX adaptée aux conditions réelles du terrain. Tu peux ajuster si le terrain le demande.\n\n";
  }

  return "Tu es expert en guildes de permaculture québécoise.\n\n" +
    "TERRAIN DIAGNOSTIQUÉ:\n" + JSON.stringify(terrain, null, 2) + "\nSuperficie allouée: " + superficie + "m²\n\n" +
    templateSection +
    "PLANTES DISPONIBLES (déjà filtrées pour la zone " + clientZone + " du client):\n" +
    JSON.stringify(plantList, null, 2) + "\n\n" +
    "PRIORISE les espèces indigènes quand c'est équivalent. Adapte les choix aux conditions réelles (sol, eau, ensoleillement). " +
    "Les quantités doivent être proportionnelles à la superficie. La distance est en mètres depuis le centre.\n\n" +
    "Réponds en JSON valide UNIQUEMENT (sans backtick):\n" +
    "{\"nom\":\"\",\"description\":\"\",\"milieu_analyse\":\"\",\"plantes\":[{\"nom\":\"\",\"quantite\":1,\"orientation\":\"S\",\"distance\":2,\"role_dans_guilde\":\"\",\"priorite\":\"obligatoire\"}],\"logique_spatiale\":\"\",\"sequence_plantation\":\"\",\"synergies_cles\":[],\"points_attention\":[]}";
}

// ─── ENTREPRISE (à personnaliser) ──────────────────────────────────────────
var COMPANY = {
  nom: "PlantExpert Québec",
  slogan: "Aménagement écologique & permaculture",
  region: "Chaudière-Appalaches",
  courriel: "info@plantexpert.ca",
  telephone: "418-000-0000",
  site: "www.plantexpert.ca",
};

// Coûts de main-d'œuvre indicatifs (design + plantation) par m²
var LABOR_PER_M2 = 8;      // $/m² pour préparation + plantation
var DESIGN_FEE = 350;       // forfait design de base

function guildSubtotal(guild) {
  var total = 0;
  if (!guild || !guild.plantes) return 0;
  for (var i = 0; i < guild.plantes.length; i++) {
    var plant = plantByName(guild.plantes[i].nom);
    var qte = guild.plantes[i].quantite || 1;
    if (plant && plant.prix) total += plant.prix * qte;
  }
  return total;
}

function estimateCosts(guild, superficie) {
  var plantes = guildSubtotal(guild);
  var labor = Math.round(LABOR_PER_M2 * (superficie || 500));
  var design = DESIGN_FEE;
  var sousTotal = plantes + labor + design;
  return {
    plantes: plantes,
    labor: labor,
    design: design,
    sousTotal: sousTotal,
    min: Math.round(sousTotal * 0.85),
    max: Math.round(sousTotal * 1.25),
  };
}

function loadJsPDF() {
  return new Promise(function(resolve, reject) {
    if (window.jspdf && window.jspdf.jsPDF) { resolve(window.jspdf.jsPDF); return; }
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = function() {
      if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF);
      else reject(new Error("jsPDF introuvable après chargement"));
    };
    script.onerror = function() { reject(new Error("Impossible de charger jsPDF")); };
    document.head.appendChild(script);
  });
}

// Convertit hex -> [r,g,b]
function hexRGB(hex) {
  var h = hex.replace("#", "");
  return [parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)];
}

function generatePDF(terrain, guild, superficie, canvasEl, onDone, onError) {
  loadJsPDF().then(function(JsPDF) {
    try {
      var doc = new JsPDF({ unit: "mm", format: "a4" });
      var W = 210, H = 297, M = 16;
      var y = 0;
      var costs = estimateCosts(guild, superficie);
      var loc = terrain && terrain.localisation ? terrain.localisation : {};
      var ter = terrain && terrain.terrain ? terrain.terrain : {};
      var pro = terrain && terrain.profil ? terrain.profil : {};

      var cForest = hexRGB(COLORS.forest);
      var cMoss = hexRGB(COLORS.moss);
      var cBark = hexRGB(COLORS.bark);
      var cCream = hexRGB(COLORS.cream);
      var cAccent = hexRGB(COLORS.accent);
      var cSlate = hexRGB(COLORS.slate);

      function setFill(rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]); }
      function setText(rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]); }
      function setDraw(rgb) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]); }

      // ═══ PAGE 1 : COUVERTURE CLIENT ═══
      setFill(cForest);
      doc.rect(0, 0, W, 95, "F");

      // Logo cercle
      doc.setFillColor(45, 90, 61);
      doc.circle(M + 10, 28, 10, "F");
      doc.setFontSize(18);
      setText([255,255,255]);
      doc.text("🌿", M + 6, 32);

      setText([255,255,255]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(COMPANY.nom.toUpperCase(), M + 26, 25);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setText(hexRGB(COLORS.fern));
      doc.text(COMPANY.slogan, M + 26, 30);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(30);
      setText(cCream);
      doc.text("Plan d'aménagement", M, 58);
      doc.setFontSize(30);
      doc.text("écologique", M, 70);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      setText(hexRGB(COLORS.mist));
      var clientLine = pro.prenom ? "Préparé pour " + pro.prenom : "Votre projet sur-mesure";
      doc.text(clientLine, M, 84);

      // Bandeau guilde
      y = 108;
      setFill(hexRGB(COLORS.sand));
      doc.roundedRect(M, y, W - 2*M, 30, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setText(cSlate);
      doc.text("VOTRE GUILDE", M + 6, y + 9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      setText(cForest);
      doc.text(guild.nom || "Guilde sur-mesure", M + 6, y + 19);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setText(cSlate);
      var meta = (loc.region || COMPANY.region) + "   •   " + superficie + " m²   •   Zone " + (loc.zone_rusticite || "3");
      doc.text(meta, M + 6, y + 26);

      // Description
      y += 40;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setText(hexRGB(COLORS.charcoal));
      var descLines = doc.splitTextToSize(guild.description || "", W - 2*M);
      doc.text(descLines, M, y);
      y += descLines.length * 5 + 6;

      // Plan visuel (canvas)
      if (canvasEl) {
        try {
          var imgData = canvasEl.toDataURL("image/png");
          var imgW = W - 2*M;
          var imgH = imgW * (canvasEl.height / canvasEl.width);
          if (y + imgH > H - 30) { y = H - 30 - imgH; }
          setDraw(hexRGB(COLORS.mist));
          doc.setLineWidth(0.5);
          doc.addImage(imgData, "PNG", M, y, imgW, imgH);
          doc.rect(M, y, imgW, imgH, "S");
          y += imgH + 4;
          doc.setFontSize(8);
          setText(cSlate);
          doc.text("Plan de placement — vue de dessus (orientation Nord en haut)", M, y);
        } catch (e) { /* skip image */ }
      }

      // Footer page 1
      setFill(cForest);
      doc.rect(0, H - 14, W, 14, "F");
      doc.setFontSize(8);
      setText(hexRGB(COLORS.mist));
      doc.text(COMPANY.courriel + "  •  " + COMPANY.telephone + "  •  " + COMPANY.site, M, H - 5);
      doc.text("Page 1", W - M - 10, H - 5);

      // ═══ PAGE 2 : ANALYSE + LISTE D'ACHAT ═══
      doc.addPage();
      y = M;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      setText(cForest);
      doc.text("Analyse de votre terrain", M, y);
      y += 3;
      setDraw(cMoss);
      doc.setLineWidth(0.8);
      doc.line(M, y + 2, W - M, y + 2);
      y += 12;

      // Grille d'analyse terrain
      var terrainRows = [
        ["Région", loc.region || "—"],
        ["Zone de rusticité", loc.zone_rusticite || "—"],
        ["Superficie", superficie + " m²"],
        ["Texture du sol", ter.sol_texture || "—"],
        ["Drainage", ter.sol_drainage || "—"],
        ["Ensoleillement", ter.ensoleillement || "—"],
        ["Topographie", ter.topographie || "—"],
        ["Présence d'eau", ter.presence_eau ? "Oui" : "Non"],
      ];
      var colW = (W - 2*M) / 2;
      for (var r = 0; r < terrainRows.length; r++) {
        var col = r % 2;
        var row = Math.floor(r / 2);
        var bx = M + col * colW;
        var by = y + row * 14;
        setFill(cCream);
        doc.roundedRect(bx, by, colW - 4, 11, 2, 2, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        setText(cSlate);
        doc.text(terrainRows[r][0].toUpperCase(), bx + 3, by + 4);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        setText(hexRGB(COLORS.charcoal));
        doc.text(String(terrainRows[r][1]), bx + 3, by + 9);
      }
      y += Math.ceil(terrainRows.length / 2) * 14 + 8;

      // Analyse du site (texte IA)
      if (guild.milieu_analyse) {
        setFill(hexRGB(COLORS.sand));
        var anaLines = doc.splitTextToSize(guild.milieu_analyse, W - 2*M - 8);
        var anaH = anaLines.length * 4.5 + 10;
        doc.roundedRect(M, y, W - 2*M, anaH, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setText(cMoss);
        doc.text("ANALYSE DU SITE", M + 4, y + 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setText(hexRGB(COLORS.charcoal));
        doc.text(anaLines, M + 4, y + 11);
        y += anaH + 10;
      }

      // Liste d'achat
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      setText(cForest);
      doc.text("Liste des végétaux", M, y);
      y += 8;

      // En-tête tableau
      setFill(cForest);
      doc.rect(M, y, W - 2*M, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setText([255,255,255]);
      doc.text("ESPÈCE", M + 3, y + 5.5);
      doc.text("STRATE", M + 78, y + 5.5);
      doc.text("QTÉ", M + 122, y + 5.5);
      doc.text("PRIX U.", M + 140, y + 5.5);
      doc.text("TOTAL", W - M - 20, y + 5.5);
      y += 8;

      // Lignes
      if (guild.plantes) {
        for (var p = 0; p < guild.plantes.length; p++) {
          var gp = guild.plantes[p];
          var plant = plantByName(gp.nom);
          var qte = gp.quantite || 1;
          var pu = plant && plant.prix ? plant.prix : 0;
          var lineTotal = pu * qte;

          if (p % 2 === 1) { setFill(cCream); doc.rect(M, y, W - 2*M, 8, "F"); }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          setText(hexRGB(COLORS.charcoal));
          doc.text(gp.nom.substring(0, 40), M + 3, y + 5.5);
          doc.setFontSize(7);
          setText(cSlate);
          var strateLabel = plant ? plant.strate.replace(/-/g, " ") : "—";
          doc.text(strateLabel.substring(0, 22), M + 78, y + 5.5);
          doc.setFontSize(8);
          setText(hexRGB(COLORS.charcoal));
          doc.text(String(qte), M + 123, y + 5.5);
          doc.text(pu + " $", M + 140, y + 5.5);
          doc.setFont("helvetica", "bold");
          doc.text(lineTotal + " $", W - M - 20, y + 5.5);
          y += 8;
        }
      }

      // Total végétaux
      setDraw(cMoss);
      doc.setLineWidth(0.4);
      doc.line(M, y, W - M, y);
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setText(cMoss);
      doc.text("Sous-total végétaux", M + 3, y);
      doc.text(costs.plantes + " $", W - M - 20, y);
      y += 12;

      // Footer page 2
      setFill(cForest);
      doc.rect(0, H - 14, W, 14, "F");
      doc.setFontSize(8);
      setText(hexRGB(COLORS.mist));
      doc.text(COMPANY.nom, M, H - 5);
      doc.text("Page 2", W - M - 10, H - 5);

      // ═══ PAGE 3 : ESTIMATION + PROCHAINES ÉTAPES ═══
      doc.addPage();
      y = M;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      setText(cForest);
      doc.text("Estimation budgétaire", M, y);
      y += 3;
      setDraw(cMoss);
      doc.setLineWidth(0.8);
      doc.line(M, y + 2, W - M, y + 2);
      y += 12;

      // Détail des coûts
      var costRows = [
        ["Végétaux (" + (guild.plantes ? guild.plantes.length : 0) + " espèces)", costs.plantes],
        ["Préparation du sol & plantation (" + superficie + " m²)", costs.labor],
        ["Conception & plan d'aménagement", costs.design],
      ];
      for (var c = 0; c < costRows.length; c++) {
        setFill(c % 2 === 0 ? cCream : [255,255,255]);
        doc.rect(M, y, W - 2*M, 10, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        setText(hexRGB(COLORS.charcoal));
        doc.text(costRows[c][0], M + 4, y + 6.5);
        doc.setFont("helvetica", "bold");
        doc.text(costRows[c][1] + " $", W - M - 24, y + 6.5);
        y += 10;
      }
      y += 4;

      // Fourchette totale
      setFill(cMoss);
      doc.roundedRect(M, y, W - 2*M, 22, 3, 3, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setText(hexRGB(COLORS.mist));
      doc.text("ESTIMATION TOTALE INDICATIVE", M + 6, y + 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      setText([255,255,255]);
      doc.text(costs.min + " $ – " + costs.max + " $", M + 6, y + 17);
      y += 30;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      setText(cSlate);
      var disc = "Estimation préliminaire basée sur les informations fournies. Un devis précis sera établi après une visite du terrain. Les prix des végétaux sont indicatifs et varient selon la disponibilité en pépinière.";
      var discLines = doc.splitTextToSize(disc, W - 2*M);
      doc.text(discLines, M, y);
      y += discLines.length * 4 + 12;

      // Prochaines étapes / CTA
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      setText(cForest);
      doc.text("Prochaines étapes", M, y);
      y += 10;

      var steps = [
        "Nous vous contactons pour planifier une visite gratuite du terrain",
        "Nous affinons le design et établissons un devis détaillé",
        "Nous préparons le sol et procédons à la plantation",
        "Nous vous accompagnons vers l'autonomie de votre aménagement",
      ];
      for (var s = 0; s < steps.length; s++) {
        doc.setFillColor(cAccent[0], cAccent[1], cAccent[2]);
        doc.circle(M + 3, y - 1, 3, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setText([255,255,255]);
        doc.text(String(s + 1), M + 2, y + 0.5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        setText(hexRGB(COLORS.charcoal));
        doc.text(steps[s], M + 10, y + 1);
        y += 11;
      }
      y += 6;

      // Encadré contact
      setFill(hexRGB(COLORS.sand));
      doc.roundedRect(M, y, W - 2*M, 30, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      setText(cForest);
      doc.text("Prêt à concrétiser votre projet ?", M + 6, y + 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setText(hexRGB(COLORS.charcoal));
      doc.text("Contactez-nous — la première consultation est gratuite.", M + 6, y + 18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setText(cMoss);
      doc.text(COMPANY.courriel + "   •   " + COMPANY.telephone, M + 6, y + 25);

      // Footer page 3
      setFill(cForest);
      doc.rect(0, H - 14, W, 14, "F");
      doc.setFontSize(8);
      setText(hexRGB(COLORS.mist));
      doc.text(COMPANY.nom + "  •  " + COMPANY.site, M, H - 5);
      doc.text("Page 3", W - M - 10, H - 5);

      var fileName = "Plan_" + (guild.nom || "amenagement").replace(/[^a-zA-Z0-9]/g, "_") + ".pdf";
      doc.save(fileName);
      onDone();
    } catch (e) {
      onError(e.message);
    }
  }).catch(function(err) {
    onError(err.message);
  });
}

// ─── DOTS ──────────────────────────────────────────────────────────────────
function Dots() {
  return (
    <div style={{display:"flex",gap:4,padding:"12px 16px",alignItems:"center"}}>
      <style>{"@keyframes boing{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}"}</style>
      <div style={{width:7,height:7,borderRadius:"50%",background:COLORS.fern,animation:"boing 1.2s ease-in-out 0s infinite"}}/>
      <div style={{width:7,height:7,borderRadius:"50%",background:COLORS.fern,animation:"boing 1.2s ease-in-out 0.2s infinite"}}/>
      <div style={{width:7,height:7,borderRadius:"50%",background:COLORS.fern,animation:"boing 1.2s ease-in-out 0.4s infinite"}}/>
    </div>
  );
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────
function Progress(props) {
  return (
    <div style={{padding:"10px 14px",background:COLORS.forest,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
      <div style={{display:"flex",gap:4}}>
        {PHASES.map(function(ph, idx) {
          return (
            <div key={idx} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{width:"100%",height:3,borderRadius:2,background:idx<=props.phase?ph.color:"rgba(255,255,255,0.15)"}}/>
              <span style={{fontSize:9,fontFamily:"monospace",color:idx===props.phase?ph.color:"rgba(255,255,255,0.3)",fontWeight:idx===props.phase?700:400,textAlign:"center"}}>{ph.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BUBBLE ───────────────────────────────────────────────────────────────
function Bubble(props) {
  var isBot = props.role === "assistant";
  return (
    <div style={{display:"flex",justifyContent:isBot?"flex-start":"flex-end",marginBottom:10}}>
      {isBot && (
        <div style={{width:34,height:34,borderRadius:"50%",background:COLORS.moss,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:8,flexShrink:0,alignSelf:"flex-end",border:"2px solid "+COLORS.fern}}>🌿</div>
      )}
      <div style={{maxWidth:"78%",background:isBot?COLORS.white:COLORS.moss,color:isBot?COLORS.charcoal:COLORS.white,borderRadius:isBot?"4px 18px 18px 18px":"18px 4px 18px 18px",padding:"11px 15px",fontFamily:"sans-serif",fontSize:14,lineHeight:1.6,boxShadow:"0 2px 8px rgba(0,0,0,0.08)",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
        {props.text}
        {props.time && <div style={{fontSize:10,color:isBot?COLORS.mist:"rgba(255,255,255,0.5)",marginTop:4,textAlign:"right",fontFamily:"monospace"}}>{props.time}</div>}
      </div>
    </div>
  );
}

// ─── SYNTHESIS CARD ───────────────────────────────────────────────────────
function SynthCard(props) {
  var s = props.data;
  var loc = s.localisation || {};
  var ter = s.terrain || {};
  var con = s.contraintes || {};
  var vis = s.vision || {};
  var pro = s.profil || {};

  var rows = [
    ["Sol", ter.sol_texture],
    ["Superficie", ter.superficie_m2 ? ter.superficie_m2+"m²" : null],
    ["Drainage", ter.sol_drainage],
    ["Lumière", ter.ensoleillement],
    ["Zone", loc.zone_rusticite],
    ["Région", loc.region],
    ["Budget", con.budget_estime],
    ["Délai", con.delai_projet],
  ].filter(function(row) { return row[1]; });

  return (
    <div style={{background:COLORS.white,border:"2px solid "+COLORS.fern,borderRadius:14,overflow:"hidden",margin:"8px 0"}}>
      <div style={{background:COLORS.forest,padding:"12px 14px"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:COLORS.cream}}>📋 Analyse de site complète</div>
        <div style={{fontFamily:"monospace",fontSize:10,color:COLORS.fern,marginTop:2}}>
          {pro.prenom ? "Projet de "+pro.prenom+" · " : ""}
          {loc.region || "Votre terrain"} · Zone {loc.zone_rusticite || "3"}
        </div>
      </div>
      <div style={{padding:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
          {rows.map(function(row) {
            return (
              <div key={row[0]} style={{background:COLORS.cream,borderRadius:7,padding:"5px 8px"}}>
                <div style={{fontSize:9,color:COLORS.slate,fontFamily:"monospace"}}>{row[0]}</div>
                <div style={{fontSize:12,fontWeight:600,color:COLORS.charcoal,fontFamily:"sans-serif"}}>{row[1]}</div>
              </div>
            );
          })}
        </div>
        {vis.priorites && vis.priorites.length > 0 && (
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
            {vis.priorites.map(function(pr) {
              return <span key={pr} style={{background:COLORS.accent+"22",color:COLORS.accent,border:"1px solid "+COLORS.accent+"55",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600,fontFamily:"sans-serif"}}>{pr}</span>;
            })}
          </div>
        )}
        <button onClick={props.onGuild} style={{width:"100%",background:COLORS.forest,color:COLORS.white,border:"none",borderRadius:10,padding:12,fontFamily:"sans-serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>
          🌿 Générer ma guilde sur-mesure
        </button>
      </div>
    </div>
  );
}

// ─── EMAIL ────────────────────────────────────────────────────────────────
function EmailForm(props) {
  var [email, setEmail] = useState("");
  var [name, setName] = useState(props.defaultName || "");
  var [done, setDone] = useState(false);

  if (done) {
    return (
      <div style={{background:"#EAF5EE",border:"2px solid "+COLORS.fern,borderRadius:12,padding:14,textAlign:"center",margin:"6px 0"}}>
        <div style={{fontSize:24,marginBottom:4}}>✅</div>
        <div style={{fontFamily:"sans-serif",fontWeight:700,color:COLORS.forest,fontSize:13}}>Parfait{name?", "+name:""}!</div>
        <div style={{fontFamily:"sans-serif",color:COLORS.slate,fontSize:11,marginTop:3}}>Analyse envoyée à <strong>{email}</strong></div>
      </div>
    );
  }

  return (
    <div style={{background:COLORS.white,border:"2px solid "+COLORS.moss,borderRadius:12,padding:14,margin:"6px 0"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,color:COLORS.forest,marginBottom:3}}>Recevoir votre analyse par courriel</div>
      <div style={{fontFamily:"sans-serif",fontSize:11,color:COLORS.slate,marginBottom:10}}>Gratuit · Sans engagement · Rapport PDF inclus</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        <input value={name} onChange={function(e){setName(e.target.value);}} placeholder="Votre prénom" style={{padding:"8px 11px",borderRadius:8,border:"1px solid "+COLORS.mist,fontFamily:"sans-serif",fontSize:13,outline:"none"}}/>
        <input value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="votre@courriel.com" type="email" style={{padding:"8px 11px",borderRadius:8,border:"1px solid "+COLORS.mist,fontFamily:"sans-serif",fontSize:13,outline:"none"}}/>
        <button onClick={function(){if(email.includes("@")){setDone(true);props.onSubmit({email:email,prenom:name});}}} style={{background:COLORS.moss,color:COLORS.white,border:"none",borderRadius:8,padding:9,fontFamily:"sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>
          Recevoir mon analyse →
        </button>
      </div>
    </div>
  );
}

// ─── GUILD CANVAS ─────────────────────────────────────────────────────────
function GuildCanvas(props) {
  var internalRef = useRef(null);
  var ref = props.canvasRef || internalRef;
  var guild = props.guild;
  var superficie = props.superficie || 500;

  useEffect(function() {
    if (!guild || !guild.plantes || !ref.current) return;
    var canvas = ref.current;
    var ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);

    var bg = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W/2);
    bg.addColorStop(0,"#E8F5E9"); bg.addColorStop(1,"#C8E6C9");
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    ctx.strokeStyle="#A5D6A7"; ctx.lineWidth=0.5;
    for(var gx=0;gx<W;gx+=36){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
    for(var gy=0;gy<H;gy+=36){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}

    var sun = ctx.createLinearGradient(0,H*0.65,0,H);
    sun.addColorStop(0,"rgba(255,220,50,0)"); sun.addColorStop(1,"rgba(255,220,50,0.15)");
    ctx.fillStyle=sun; ctx.fillRect(0,H*0.65,W,H*0.35);

    ctx.font="bold 11px monospace"; ctx.fillStyle="#2D5A3D"; ctx.textAlign="center";
    ctx.fillText("N ↑",W/2,15); ctx.fillText("S ↓",W/2,H-5);
    ctx.fillText("O",12,H/2); ctx.fillText("E",W-12,H/2);

    var scale = Math.min(W,H)*0.65/Math.sqrt(superficie);
    var cx=W/2, cy=H/2;
    var dirs = {"N":{dx:0,dy:-1},"N-E":{dx:.7,dy:-.7},"E":{dx:1,dy:0},"S-E":{dx:.7,dy:.7},"S":{dx:0,dy:1},"S-O":{dx:-.7,dy:.7},"O":{dx:-1,dy:0},"N-O":{dx:-.7,dy:-.7}};

    for(var pi=0; pi<guild.plantes.length; pi++) {
      var gp = guild.plantes[pi];
      var plant = plantByName(gp.nom);
      if(!plant) continue;

      var dir = dirs[gp.orientation || plant.orientation_preferee];
      if(!dir){ var angle=pi*Math.PI*2/guild.plantes.length; dir={dx:Math.cos(angle),dy:Math.sin(angle)}; }

      var spread = (gp.distance||(pi+1)*0.7)*scale;
      var px=cx+dir.dx*spread, py=cy+dir.dy*spread;
      var r=Math.max(14,Math.min(40,(plant.hauteur[1]/20)*40));

      ctx.beginPath(); ctx.ellipse(px+4,py+5,r*1.3,r*0.5,0,0,Math.PI*2);
      ctx.fillStyle="rgba(0,0,0,0.07)"; ctx.fill();

      var cg=ctx.createRadialGradient(px-r*0.3,py-r*0.3,0,px,py,r);
      cg.addColorStop(0,plant.couleur+"EE"); cg.addColorStop(1,plant.couleur+"88");
      ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2);
      ctx.fillStyle=cg; ctx.fill();
      ctx.strokeStyle=plant.couleur; ctx.lineWidth=2; ctx.stroke();

      ctx.font=Math.max(14,r*0.75)+"px serif";
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(plant.emoji,px,py);

      ctx.font="bold 9px sans-serif"; ctx.textBaseline="top";
      var lbl=gp.nom.split(" ")[0];
      var tw=ctx.measureText(lbl).width;
      ctx.fillStyle="rgba(255,255,255,0.85)";
      ctx.fillRect(px-tw/2-2,py+r+2,tw+4,12);
      ctx.fillStyle="#1A3A2A"; ctx.fillText(lbl,px,py+r+3);
      if(gp.quantite>1){ ctx.font="8px monospace"; ctx.fillStyle="#8B6B4A"; ctx.fillText("x"+gp.quantite,px,py+r+15); }
    }

    ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2); ctx.fillStyle=COLORS.bark; ctx.fill();
    ctx.font="9px sans-serif"; ctx.fillStyle=COLORS.bark; ctx.textAlign="center"; ctx.textBaseline="top";
    ctx.fillText("centre",cx,cy+7);
  }, [guild, superficie]);

  return <canvas ref={ref} width={440} height={360} style={{borderRadius:12,display:"block",width:"100%",border:"2px solid "+COLORS.mist}}/>;
}

// ─── GUILD VIEW ───────────────────────────────────────────────────────────
function GuildView(props) {
  var terrain = props.terrain;
  var parcoursId = props.parcours || "debutant";
  var parcours = PARCOURS[parcoursId];
  var [guild, setGuild] = useState(null);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [tab, setTab] = useState(props.parcours === "expert" ? "liste" : "plan");
  var [pdfState, setPdfState] = useState("idle"); // idle | working | done | error
  var [pdfError, setPdfError] = useState(null);
  var canvasRef = useRef(null);

  var superficie = terrain && terrain.terrain && terrain.terrain.superficie_m2 ? terrain.terrain.superficie_m2 : 500;

  function handlePDF() {
    setPdfState("working");
    setPdfError(null);
    generatePDF(
      terrain, guild, superficie, canvasRef.current,
      function() { setPdfState("done"); setTimeout(function(){ setPdfState("idle"); }, 3000); },
      function(msg) { setPdfState("error"); setPdfError(msg); }
    );
  }

  useEffect(function() {
    var cancelled = false;
    callClaude(
      [{role:"user", content:buildGuildPrompt(terrain, superficie, props.template)}],
      null,
      function(text) {
        if (cancelled) return;
        try {
          var clean = text.replace(/```json\n?|```/g,"").trim();
          setGuild(JSON.parse(clean));
          setLoading(false);
        } catch(e) {
          setError("Erreur de format : "+e.message);
          setLoading(false);
        }
      },
      function(msg) {
        if (!cancelled) { setError(msg); setLoading(false); }
      }
    );
    return function() { cancelled = true; };
  }, []);

  if (loading) return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:COLORS.cream,gap:16}}>
      <style>{"@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}"}</style>
      <div style={{fontSize:48,animation:"spin 3s linear infinite"}}>🌿</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,color:COLORS.forest}}>Génération de votre guilde…</div>
      <div style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.slate,maxWidth:280,textAlign:"center"}}>Sylvie analyse les conditions de votre terrain pour sélectionner les espèces les plus adaptées.</div>
    </div>
  );

  if (error) return (
    <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:COLORS.cream}}>
      <div style={{textAlign:"center",padding:32}}>
        <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
        <div style={{fontFamily:"sans-serif",color:COLORS.danger,marginBottom:16,fontSize:13}}>{error}</div>
        <button onClick={props.onBack} style={{background:COLORS.moss,color:COLORS.white,border:"none",borderRadius:10,padding:"10px 20px",fontFamily:"sans-serif",fontWeight:700,cursor:"pointer"}}>← Retour</button>
      </div>
    </div>
  );

  var tabs = [{id:"plan",label:"🗺️ Plan"},{id:"profil",label:"🌲 Profil"},{id:"liste",label:"📋 Plantes"},{id:"rapport",label:"📄 Rapport"}];
  var loc = terrain && terrain.localisation ? terrain.localisation : {};
  var ter = terrain && terrain.terrain ? terrain.terrain : {};

  return (
    <div style={{minHeight:"100vh",background:COLORS.cream,display:"flex",flexDirection:"column"}}>
      <div style={{background:COLORS.forest,padding:"12px 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <button onClick={props.onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"6px 10px",color:COLORS.mist,cursor:"pointer",fontFamily:"sans-serif",fontSize:12}}>← Retour</button>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,color:COLORS.cream,lineHeight:1.1}}>{guild && guild.nom}</div>
            <div style={{fontFamily:"monospace",fontSize:10,color:COLORS.fern,marginTop:2}}>{loc.region||"Votre terrain"} · {superficie}m²</div>
          </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {[ter.sol_texture?"Sol "+ter.sol_texture:null, ter.ensoleillement, ter.sol_drainage].filter(Boolean).map(function(tag,i){
            return <span key={i} style={{background:"rgba(255,255,255,0.12)",color:COLORS.mist,borderRadius:6,padding:"2px 8px",fontSize:10,fontFamily:"monospace"}}>{tag}</span>;
          })}
        </div>
      </div>

      {guild && (
        <div style={{background:COLORS.moss,padding:"12px 14px"}}>
          <p style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.cream,lineHeight:1.6,margin:"0 0 8px"}}>{guild.description}</p>
          <div style={{background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 10px"}}>
            <div style={{fontSize:10,color:COLORS.fern,fontFamily:"monospace",marginBottom:3}}>ANALYSE DU SITE</div>
            <p style={{fontFamily:"sans-serif",fontSize:12,color:COLORS.mist,margin:0,lineHeight:1.5}}>{guild.milieu_analyse}</p>
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:1,background:COLORS.sand}}>
        {tabs.map(function(t){
          return <button key={t.id} onClick={function(){setTab(t.id);}} style={{flex:1,padding:"10px 4px",border:"none",background:tab===t.id?COLORS.white:COLORS.sand,color:tab===t.id?COLORS.forest:COLORS.slate,fontFamily:"sans-serif",fontWeight:tab===t.id?700:400,fontSize:12,cursor:"pointer"}}>{t.label}</button>;
        })}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 40px"}}>
        {tab==="plan" && guild && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <GuildCanvas guild={guild} superficie={superficie} canvasRef={canvasRef}/>
            <div style={{background:COLORS.white,borderRadius:10,padding:12}}>
              <div style={{fontSize:10,color:COLORS.slate,fontFamily:"monospace",marginBottom:4}}>LOGIQUE SPATIALE</div>
              <p style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.charcoal,margin:0,lineHeight:1.5}}>{guild.logique_spatiale}</p>
            </div>
            <div style={{background:COLORS.white,borderRadius:10,padding:12}}>
              <div style={{fontSize:10,color:COLORS.slate,fontFamily:"monospace",marginBottom:8}}>LÉGENDE</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {guild.plantes && guild.plantes.map(function(gp){
                  var plant=plantByName(gp.nom);
                  if(!plant) return null;
                  return <div key={gp.nom} style={{display:"flex",alignItems:"center",gap:4,background:COLORS.cream,borderRadius:6,padding:"3px 8px"}}><div style={{width:10,height:10,borderRadius:"50%",background:plant.couleur,flexShrink:0}}/><span style={{fontSize:11,fontFamily:"sans-serif",color:COLORS.charcoal}}>{plant.emoji} {gp.nom}</span><span style={{fontSize:10,fontFamily:"monospace",color:COLORS.bark}}>x{gp.quantite}</span></div>;
                })}
              </div>
            </div>
          </div>
        )}

        {tab==="profil" && guild && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:COLORS.white,borderRadius:12,padding:14}}>
              <div style={{fontFamily:"sans-serif",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",color:COLORS.slate,marginBottom:10}}>Profil · coupe transversale</div>
              {STRATES.map(function(strate,si){
                var inStrate=guild.plantes?guild.plantes.filter(function(gp){var pl=plantByName(gp.nom);return pl&&pl.strate===strate.id;}) : [];
                return (
                  <div key={strate.id} style={{display:"flex",alignItems:"stretch",gap:8,minHeight:inStrate.length?36:24}}>
                    <div style={{width:10,background:strate.c,opacity:0.7,borderRadius:si===0?"4px 4px 0 0":si===STRATES.length-1?"0 0 4px 4px":0}}/>
                    <div style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:"3px 0",borderBottom:si<STRATES.length-1?"1px dashed "+COLORS.sand:"none"}}>
                      <span style={{fontSize:9,fontFamily:"monospace",color:COLORS.slate,minWidth:90}}>{strate.label}</span>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {inStrate.map(function(gp){var pl=plantByName(gp.nom);return pl?<span key={gp.nom} title={gp.nom} style={{fontSize:14}}>{pl.emoji}</span>:null;})}
                        {inStrate.length===0&&<span style={{fontSize:10,color:COLORS.mist,fontStyle:"italic"}}>—</span>}
                      </div>
                    </div>
                    <div style={{fontSize:9,color:COLORS.mist,fontFamily:"monospace",display:"flex",alignItems:"center",whiteSpace:"nowrap"}}>{strate.h}</div>
                  </div>
                );
              })}
            </div>
            <div style={{background:COLORS.white,borderRadius:10,padding:12}}>
              <div style={{fontSize:10,color:COLORS.slate,fontFamily:"monospace",marginBottom:6}}>SÉQUENCE DE PLANTATION</div>
              <p style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.charcoal,margin:0,lineHeight:1.5}}>{guild.sequence_plantation}</p>
            </div>
          </div>
        )}

        {tab==="liste" && guild && guild.plantes && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:COLORS.white,borderRadius:10,padding:12}}>
              <div style={{fontSize:10,color:COLORS.slate,fontFamily:"monospace",marginBottom:8}}>LISTE D'ACHAT · {superficie}m²</div>
              {guild.plantes.map(function(gp,idx){
                var plant=plantByName(gp.nom);
                var pc=gp.priorite==="obligatoire"?COLORS.moss:gp.priorite==="recommandé"?COLORS.fern:COLORS.slate;
                return (
                  <div key={idx} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:idx<guild.plantes.length-1?"1px solid "+COLORS.sand:"none"}}>
                    <span style={{fontSize:18}}>{plant?plant.emoji:"🌿"}</span>
                    <div style={{flex:1,fontFamily:"sans-serif",fontSize:13,color:COLORS.charcoal}}>{gp.nom}</div>
                    <div style={{fontFamily:"monospace",fontSize:12,color:COLORS.bark,fontWeight:700}}>x{gp.quantite}</div>
                    <span style={{background:pc,color:COLORS.white,borderRadius:4,padding:"2px 6px",fontSize:9,fontWeight:700,fontFamily:"monospace"}}>{gp.priorite}</span>
                  </div>
                );
              })}
            </div>
            {guild.plantes.map(function(gp,idx){
              var plant=plantByName(gp.nom);
              if(!plant) return null;
              var bc=gp.priorite==="obligatoire"?COLORS.moss:gp.priorite==="recommandé"?COLORS.fern:COLORS.sand;
              return (
                <div key={idx} style={{background:COLORS.white,borderRadius:12,padding:14,border:"2px solid "+bc}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:8}}>
                    <span style={{fontSize:26}}>{plant.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:COLORS.forest}}>{gp.nom}</div>
                      <div style={{fontFamily:"sans-serif",fontSize:10,color:COLORS.slate,fontStyle:"italic"}}>{plant.latin} · x{gp.quantite} · {gp.orientation} · {gp.distance}m du centre</div>
                    </div>
                  </div>
                  <div style={{background:COLORS.cream,borderRadius:8,padding:"8px 10px",marginBottom:8}}>
                    <div style={{fontSize:10,color:COLORS.slate,fontFamily:"monospace",marginBottom:3}}>RÔLE DANS CETTE GUILDE</div>
                    <div style={{fontFamily:"sans-serif",fontSize:12,color:COLORS.charcoal,lineHeight:1.5}}>{gp.role_dans_guilde}</div>
                  </div>
                  <div style={{fontFamily:"sans-serif",fontSize:12,color:COLORS.slate,lineHeight:1.5,marginBottom:8}}>{plant.ecologie}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {plant.fonctions.map(function(fn){
                      return <span key={fn} style={{display:"inline-block",padding:"2px 7px",borderRadius:4,background:FN_COLORS[fn]||COLORS.slate,color:"#fff",fontSize:10,fontWeight:700,fontFamily:"monospace"}}>{fn}</span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="rapport" && guild && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>

            {/* Estimation budgétaire */}
            <div style={{background:COLORS.white,borderRadius:12,padding:14}}>
              <div style={{fontSize:10,color:COLORS.slate,fontFamily:"monospace",marginBottom:10}}>ESTIMATION BUDGÉTAIRE INDICATIVE</div>
              {(function(){
                var costs = estimateCosts(guild, superficie);
                var lines = [
                  ["Végétaux (" + (guild.plantes?guild.plantes.length:0) + " espèces)", costs.plantes],
                  ["Préparation & plantation (" + superficie + "m²)", costs.labor],
                  ["Conception & plan", costs.design],
                ];
                return (
                  <div>
                    {lines.map(function(ln,i){
                      return (
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid "+COLORS.sand}}>
                          <span style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.charcoal}}>{ln[0]}</span>
                          <span style={{fontFamily:"monospace",fontSize:13,color:COLORS.bark,fontWeight:700}}>{ln[1]} $</span>
                        </div>
                      );
                    })}
                    <div style={{background:COLORS.moss,borderRadius:10,padding:12,marginTop:10,textAlign:"center"}}>
                      <div style={{fontSize:10,color:COLORS.mist,fontFamily:"monospace",marginBottom:2}}>ESTIMATION TOTALE</div>
                      <div style={{fontSize:22,color:COLORS.white,fontWeight:700,fontFamily:"Georgia,serif"}}>{costs.min} $ – {costs.max} $</div>
                    </div>
                    <div style={{fontSize:10,color:COLORS.slate,fontFamily:"sans-serif",fontStyle:"italic",marginTop:8,lineHeight:1.4}}>
                      Estimation préliminaire. Un devis précis sera établi après une visite gratuite du terrain.
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Synergies */}
            <div style={{background:COLORS.white,borderRadius:12,padding:14}}>
              <div style={{fontSize:10,color:COLORS.slate,fontFamily:"monospace",marginBottom:10}}>SYNERGIES CLÉS</div>
              {guild.synergies_cles && guild.synergies_cles.map(function(syn,i){
                return <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<guild.synergies_cles.length-1?"1px solid "+COLORS.sand:"none"}}><span style={{fontSize:16,flexShrink:0}}>✅</span><span style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.charcoal,lineHeight:1.5}}>{syn}</span></div>;
              })}
            </div>

            {/* Points d'attention */}
            <div style={{background:COLORS.white,borderRadius:12,padding:14}}>
              <div style={{fontSize:10,color:COLORS.slate,fontFamily:"monospace",marginBottom:10}}>POINTS D'ATTENTION</div>
              {guild.points_attention && guild.points_attention.map(function(pt,i){
                return <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<guild.points_attention.length-1?"1px solid "+COLORS.sand:"none"}}><span style={{fontSize:16,flexShrink:0}}>⚠️</span><span style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.charcoal,lineHeight:1.5}}>{pt}</span></div>;
              })}
            </div>

            {/* CTA adapté au parcours */}
            <div style={{background:parcours.couleur,borderRadius:14,padding:18}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:28}}>{parcours.emoji}</span>
                <div>
                  <div style={{fontFamily:"monospace",fontSize:10,color:"rgba(255,255,255,0.7)"}}>PARCOURS {parcours.niveau.toUpperCase()}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:COLORS.white}}>{parcours.ctaTitre}</div>
                </div>
              </div>
              <div style={{fontFamily:"sans-serif",fontSize:12,color:"rgba(255,255,255,0.85)",marginBottom:12,lineHeight:1.5}}>{parcours.ctaDesc}</div>
              {parcours.ctaSecondaire && (
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
                  {parcours.ctaSecondaire.map(function(svc,i){
                    return (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"8px 12px"}}>
                        <span style={{color:COLORS.white,fontSize:14}}>✓</span>
                        <span style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.white,fontWeight:500}}>{svc}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <button onClick={function(){ alert(parcours.ctaBouton + "\n\n(Dans la vraie app : formulaire de contact / prise de rendez-vous / panier de commande selon le parcours)"); }}
                style={{width:"100%",background:COLORS.white,color:parcours.couleur,border:"none",borderRadius:12,padding:14,fontFamily:"sans-serif",fontWeight:700,fontSize:15,cursor:"pointer"}}>
                {parcours.ctaBouton}
              </button>
            </div>

            {/* Bouton PDF */}
            <div style={{background:COLORS.forest,borderRadius:14,padding:18,textAlign:"center"}}>
              <div style={{fontSize:30,marginBottom:6}}>📄</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:COLORS.cream,marginBottom:4}}>Votre rapport complet</div>
              <div style={{fontFamily:"sans-serif",fontSize:12,color:COLORS.mist,marginBottom:14,lineHeight:1.5}}>
                Plan visuel, analyse du terrain, liste des végétaux, estimation budgétaire et prochaines étapes — en un document PDF prêt à partager.
              </div>
              <button
                onClick={handlePDF}
                disabled={pdfState==="working"}
                style={{
                  width:"100%",
                  background: pdfState==="done" ? COLORS.fern : COLORS.accent,
                  color:COLORS.white, border:"none", borderRadius:12, padding:14,
                  fontFamily:"sans-serif", fontWeight:700, fontSize:15,
                  cursor: pdfState==="working" ? "wait" : "pointer",
                }}
              >
                {pdfState==="working" ? "⏳ Génération du PDF…" : pdfState==="done" ? "✅ PDF téléchargé !" : "⬇️ Télécharger le rapport PDF"}
              </button>
              {pdfState==="error" && (
                <div style={{marginTop:10,padding:10,background:"rgba(192,57,43,0.2)",borderRadius:8,color:"#FFCDD2",fontSize:12,fontFamily:"sans-serif"}}>
                  Erreur : {pdfError}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ─── AGENT VIEW ───────────────────────────────────────────────────────────
function AgentView(props) {
  var parcoursId = props.parcours || "debutant";
  var parcours = PARCOURS[parcoursId];
  var agentSystem = systemForParcours(parcoursId);

  var [msgs, setMsgs] = useState([]);
  var [input, setInput] = useState("");
  var [busy, setBusy] = useState(false);
  var [synth, setSynth] = useState(null);
  var [leadDone, setLeadDone] = useState(false);
  var [started, setStarted] = useState(false);
  var chatEl = useRef(null);
  var inputEl = useRef(null);
  var phase = getPhase(msgs);

  useEffect(function() {
    if (chatEl.current) {
      setTimeout(function() { chatEl.current.scrollTop = chatEl.current.scrollHeight; }, 100);
    }
  }, [msgs, busy]);

  useEffect(function() {
    if (!started) { setStarted(true); doStart(); }
  }, []);

  function doSend(text) {
    var txt = (text || input).trim();
    if (!txt || busy) return;
    var ts = timeNow();
    var newMsgs = msgs.concat([{role:"user", content:txt, time:ts}]);
    setMsgs(newMsgs);
    setInput("");
    setBusy(true);

    var apiMsgs = newMsgs.map(function(m){ return {role:m.role, content:m.content}; });
    callClaude(apiMsgs, agentSystem,
      function(raw) {
        var found = extractJSON(raw);
        var clean = stripJSON(raw);
        setMsgs(function(prev){ return prev.concat([{role:"assistant",content:clean,time:timeNow()}]); });
        if (found) setSynth(found);
        setBusy(false);
        if (inputEl.current) inputEl.current.focus();
      },
      function(errMsg) {
        setMsgs(function(prev){ return prev.concat([{role:"assistant",content:"⚠️ Erreur technique : " + errMsg,time:timeNow()}]); });
        setBusy(false);
      }
    );
  }

  function doStart() {
    setBusy(true);
    var opener = parcoursId === "expert"
      ? "Salut, je veux la liste des végétaux pour mon terrain."
      : "Bonjour, je voudrais analyser mon terrain.";
    callClaude([{role:"user",content:opener}], agentSystem,
      function(raw) {
        var ts = timeNow();
        setMsgs([
          {role:"assistant",content:stripJSON(raw),time:ts},
        ]);
        setBusy(false);
      },
      function(errMsg) {
        setMsgs([{role:"assistant",content:"⚠️ Erreur au démarrage : " + errMsg + "\n\nMais pas de souci, on peut continuer ! Dans quelle région se trouve votre terrain ?",time:timeNow()}]);
        setBusy(false);
      }
    );
  }

  var quickList = QUICK_REPLIES[Math.min(phase, QUICK_REPLIES.length-1)] || [];

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:COLORS.cream}}>
      <div style={{background:COLORS.forest,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={props.onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,width:32,height:32,color:COLORS.mist,cursor:"pointer",fontSize:16,flexShrink:0}}>←</button>
        <div style={{width:38,height:38,borderRadius:"50%",background:COLORS.moss,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,border:"2px solid "+COLORS.fern,flexShrink:0}}>🌿</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"sans-serif",fontWeight:700,fontSize:14,color:COLORS.cream}}>Sylvie</div>
          <div style={{fontSize:10,color:COLORS.fern,display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:COLORS.fern,display:"inline-block"}}/>
            Conseillère en aménagement écologique
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.12)",borderRadius:8,padding:"4px 8px",textAlign:"center"}}>
          <div style={{fontSize:14}}>{parcours.emoji}</div>
          <div style={{fontFamily:"monospace",fontSize:8,color:COLORS.mist}}>{parcours.niveau}</div>
        </div>
      </div>

      <Progress phase={phase}/>

      <div ref={chatEl} style={{flex:1,overflowY:"auto",padding:"14px 12px"}}>
        {msgs.length===0 && busy && (
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:48,marginBottom:12}}>🌿</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:18,color:COLORS.forest}}>Sylvie prépare vos questions…</div>
          </div>
        )}

        {msgs.map(function(m,i){ return <Bubble key={i} role={m.role} text={m.content} time={m.time}/>; })}

        {busy && (
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:COLORS.moss,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,border:"2px solid "+COLORS.fern}}>🌿</div>
            <div style={{background:COLORS.white,borderRadius:"4px 18px 18px 18px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}><Dots/></div>
          </div>
        )}

        {synth && !busy && <SynthCard data={synth} onGuild={function(){ props.onGuild(synth); }}/>}
        {synth && !busy && <EmailForm defaultName={synth.profil&&synth.profil.prenom} submitted={leadDone} onSubmit={function(d){ setLeadDone(true); console.log("LEAD:",d,synth); }}/>}
      </div>

      {!synth && (
        <div style={{padding:"0 12px"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,paddingBottom:6}}>
            {quickList.map(function(r){ return <button key={r} onClick={function(){doSend(r);}} style={{background:COLORS.cream,border:"1px solid "+COLORS.mist,borderRadius:20,padding:"4px 11px",fontFamily:"sans-serif",fontSize:12,color:COLORS.moss,cursor:"pointer",fontWeight:500}}>{r}</button>; })}
          </div>
        </div>
      )}

      {!synth && (
        <div style={{padding:"8px 12px 14px",background:COLORS.white,borderTop:"1px solid "+COLORS.sand,display:"flex",gap:7,alignItems:"flex-end"}}>
          <textarea ref={inputEl} value={input} onChange={function(e){setInput(e.target.value);}}
            onKeyDown={function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();doSend(input);}}}
            placeholder="Écrivez votre réponse…" rows={1}
            style={{flex:1,padding:"9px 13px",borderRadius:12,border:"2px solid "+(input?COLORS.moss:COLORS.mist),fontFamily:"sans-serif",fontSize:14,color:COLORS.charcoal,background:COLORS.cream,outline:"none",resize:"none",lineHeight:1.5,maxHeight:100,overflowY:"auto"}}/>
          <button onClick={function(){doSend(input);}} disabled={!input.trim()||busy}
            style={{width:42,height:42,borderRadius:11,border:"none",background:input.trim()&&!busy?COLORS.moss:COLORS.mist,color:COLORS.white,cursor:input.trim()&&!busy?"pointer":"not-allowed",fontSize:18,flexShrink:0}}>↑</button>
        </div>
      )}

      {synth && (
        <div style={{padding:"8px 12px 14px",background:COLORS.white,borderTop:"1px solid "+COLORS.sand,display:"flex",gap:7}}>
          <input value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")doSend(input);}} placeholder="Questions ou précisions ?" style={{flex:1,padding:"9px 13px",borderRadius:11,border:"1px solid "+COLORS.mist,fontFamily:"sans-serif",fontSize:13,color:COLORS.charcoal,background:COLORS.cream,outline:"none"}}/>
          <button onClick={function(){doSend(input);}} disabled={!input.trim()||busy} style={{width:40,height:40,borderRadius:10,border:"none",background:input.trim()?COLORS.moss:COLORS.mist,color:COLORS.white,cursor:"pointer",fontSize:16}}>↑</button>
        </div>
      )}
    </div>
  );
}

// ─── GUILD SELECTOR (recommandation + choix des guildes-modèles) ───────────
function GuildSelector(props) {
  var terrain = props.terrain;
  var superficie = terrain && terrain.terrain && terrain.terrain.superficie_m2 ? terrain.terrain.superficie_m2 : 500;
  var clientZone = terrain && terrain.localisation ? terrain.localisation.zone_rusticite : "3";
  var available = templatesForZone(clientZone);

  var [recs, setRecs] = useState(null);       // recommandations IA
  var [logique, setLogique] = useState("");
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [selected, setSelected] = useState({}); // {template_id: true}

  useEffect(function() {
    var cancelled = false;
    callClaude(
      [{role:"user", content:buildRecommendPrompt(terrain, superficie)}],
      null,
      function(text) {
        if (cancelled) return;
        try {
          var clean = text.replace(/```json\n?|```/g,"").trim();
          var parsed = JSON.parse(clean);
          setRecs(parsed.recommandations || []);
          setLogique(parsed.logique_ensemble || "");
          // Pré-sélectionner les guildes recommandées
          var pre = {};
          (parsed.recommandations || []).forEach(function(r){ pre[r.template_id] = true; });
          setSelected(pre);
          setLoading(false);
        } catch(e) {
          // Fallback : recommander la première guilde compatible
          if (available.length > 0) {
            setRecs([{template_id: available[0].id, raison: "Guilde bien adaptée à votre zone.", superficie_allouee_m2: superficie}]);
            var pre2 = {}; pre2[available[0].id] = true; setSelected(pre2);
          }
          setLoading(false);
        }
      },
      function(msg) {
        if (!cancelled) {
          if (available.length > 0) {
            setRecs([{template_id: available[0].id, raison: "Guilde bien adaptée à votre zone.", superficie_allouee_m2: superficie}]);
            var pre3 = {}; pre3[available[0].id] = true; setSelected(pre3);
          }
          setLoading(false);
        }
      }
    );
    return function(){ cancelled = true; };
  }, []);

  function toggle(tid) {
    setSelected(function(prev){
      var next = Object.assign({}, prev);
      if (next[tid]) delete next[tid]; else next[tid] = true;
      return next;
    });
  }

  function templateById(tid) {
    for (var i=0;i<GUILD_TEMPLATES.length;i++) if (GUILD_TEMPLATES[i].id===tid) return GUILD_TEMPLATES[i];
    return null;
  }

  function recFor(tid) {
    if (!recs) return null;
    for (var i=0;i<recs.length;i++) if (recs[i].template_id===tid) return recs[i];
    return null;
  }

  var selectedList = Object.keys(selected);

  if (loading) return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:COLORS.cream,gap:16}}>
      <style>{"@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}"}</style>
      <div style={{fontSize:48,animation:"spin 3s linear infinite"}}>🌿</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:20,color:COLORS.forest}}>Analyse de votre terrain…</div>
      <div style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.slate,maxWidth:280,textAlign:"center"}}>Sylvie identifie les guildes les mieux adaptées à votre zone et vos objectifs.</div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:COLORS.cream,display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{background:COLORS.forest,padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={props.onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,width:32,height:32,color:COLORS.mist,cursor:"pointer",fontSize:16,flexShrink:0}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:COLORS.cream,lineHeight:1.1}}>Vos guildes recommandées</div>
            <div style={{fontFamily:"monospace",fontSize:10,color:COLORS.fern,marginTop:2}}>{clientZone?("Zone "+clientZone):""} · {superficie}m² · {available.length} modèles compatibles</div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 120px",maxWidth:560,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        {logique && (
          <div style={{background:COLORS.moss,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:10,color:COLORS.fern,fontFamily:"monospace",marginBottom:4}}>LOGIQUE D'ENSEMBLE</div>
            <p style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.cream,margin:0,lineHeight:1.5}}>{logique}</p>
          </div>
        )}

        <div style={{fontFamily:"monospace",fontSize:11,color:COLORS.slate,marginBottom:10}}>SÉLECTIONNEZ VOS GUILDES (ajoutez ou retirez)</div>

        {available.map(function(tpl){
          var rec = recFor(tpl.id);
          var isRecommended = !!rec;
          var isSelected = !!selected[tpl.id];
          return (
            <div key={tpl.id} onClick={function(){ toggle(tpl.id); }}
              style={{
                background:COLORS.white,
                border:"2px solid "+(isSelected?tpl.couleur:COLORS.sand),
                borderRadius:14, padding:14, marginBottom:10, cursor:"pointer",
                transition:"all 0.15s",
                boxShadow:isSelected?"0 4px 14px "+tpl.couleur+"33":"0 1px 4px rgba(0,0,0,0.05)",
              }}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{width:46,height:46,borderRadius:12,background:tpl.couleur+"22",border:"2px solid "+tpl.couleur+"55",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{tpl.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:COLORS.forest}}>{tpl.nom}</span>
                    {isRecommended && <span style={{background:tpl.couleur,color:COLORS.white,borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700,fontFamily:"monospace"}}>RECOMMANDÉ</span>}
                  </div>
                  <div style={{fontFamily:"sans-serif",fontSize:12,color:COLORS.slate,lineHeight:1.5,marginTop:4}}>{tpl.desc}</div>
                  {rec && rec.raison && (
                    <div style={{background:COLORS.cream,borderRadius:8,padding:"6px 10px",marginTop:8}}>
                      <span style={{fontFamily:"sans-serif",fontSize:11,color:tpl.couleur,fontWeight:600}}>💡 {rec.raison}</span>
                    </div>
                  )}
                </div>
                <div style={{width:26,height:26,borderRadius:"50%",border:"2px solid "+(isSelected?tpl.couleur:COLORS.mist),background:isSelected?tpl.couleur:COLORS.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {isSelected && <span style={{color:COLORS.white,fontSize:14,fontWeight:700}}>✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barre d'action fixe */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:COLORS.white,borderTop:"1px solid "+COLORS.sand,padding:"12px 16px",boxShadow:"0 -2px 12px rgba(0,0,0,0.08)"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <button
            onClick={function(){ if(selectedList.length>0) props.onConfirm(selectedList.map(templateById).filter(Boolean)); }}
            disabled={selectedList.length===0}
            style={{width:"100%",background:selectedList.length>0?COLORS.forest:COLORS.mist,color:COLORS.white,border:"none",borderRadius:12,padding:14,fontFamily:"sans-serif",fontWeight:700,fontSize:15,cursor:selectedList.length>0?"pointer":"not-allowed"}}>
            {selectedList.length===0 ? "Sélectionnez au moins une guilde" : "Générer "+selectedList.length+" guilde"+(selectedList.length>1?"s":"")+" →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PARCOURS LANDING ──────────────────────────────────────────────────────
function ParcoursLanding(props) {
  var cards = [PARCOURS.debutant, PARCOURS.intermediaire, PARCOURS.expert];

  return (
    <div style={{minHeight:"100vh",background:COLORS.cream,display:"flex",flexDirection:"column"}}>
      <div style={{background:COLORS.forest,padding:"32px 20px 28px",textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:8}}>🌿</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:COLORS.cream,lineHeight:1.15}}>Aménagez votre terrain</div>
        <div style={{fontFamily:"sans-serif",fontSize:14,color:COLORS.mist,marginTop:8,maxWidth:340,margin:"8px auto 0",lineHeight:1.5}}>
          Choisissez votre parcours. Sylvie, notre conseillère, s'adapte à votre niveau et vos besoins.
        </div>
      </div>

      <div style={{flex:1,padding:"20px 16px 40px",display:"flex",flexDirection:"column",gap:14,maxWidth:520,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        <div style={{fontFamily:"monospace",fontSize:11,color:COLORS.slate,textAlign:"center",marginBottom:2}}>QUI ÊTES-VOUS ?</div>
        {cards.map(function(p){
          return (
            <button key={p.id} onClick={function(){ props.onSelect(p.id); }}
              style={{
                background:COLORS.white, border:"2px solid "+COLORS.sand, borderRadius:16,
                padding:18, cursor:"pointer", textAlign:"left", display:"flex",
                gap:14, alignItems:"flex-start", transition:"all 0.15s",
                boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
              }}>
              <div style={{
                width:52, height:52, borderRadius:14, background:p.couleur+"22",
                border:"2px solid "+p.couleur+"55", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:26, flexShrink:0,
              }}>{p.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                  <span style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:17,color:COLORS.forest}}>{p.titre}</span>
                </div>
                <div style={{fontFamily:"sans-serif",fontSize:12,fontWeight:600,color:p.couleur,marginBottom:6}}>{p.niveau} · {p.sousTitre}</div>
                <div style={{fontFamily:"sans-serif",fontSize:13,color:COLORS.slate,lineHeight:1.5}}>{p.desc}</div>
                <div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:6,background:p.couleur,color:COLORS.white,borderRadius:8,padding:"6px 12px",fontFamily:"sans-serif",fontSize:12,fontWeight:700}}>
                  {p.ctaBouton} →
                </div>
              </div>
            </button>
          );
        })}
        <div style={{textAlign:"center",fontFamily:"sans-serif",fontSize:11,color:COLORS.mist,marginTop:6}}>
          Gratuit · Sans inscription · Vous repartez avec votre plan
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  var [screen, setScreen] = useState("landing"); // landing | agent | select | guild
  var [parcours, setParcours] = useState("debutant");
  var [terrain, setTerrain] = useState(null);
  var [templates, setTemplates] = useState([]); // guildes-modèles sélectionnées
  var [activeGuild, setActiveGuild] = useState(0);

  if (screen === "landing") {
    return <ParcoursLanding onSelect={function(pid){ setParcours(pid); setScreen("agent"); }}/>;
  }

  if (screen === "select" && terrain) {
    return <GuildSelector
      terrain={terrain}
      onBack={function(){ setScreen("agent"); }}
      onConfirm={function(tpls){ setTemplates(tpls); setActiveGuild(0); setScreen("guild"); }}
    />;
  }

  if (screen === "guild" && terrain) {
    var current = templates.length > 0 ? templates[activeGuild] : null;
    return (
      <div style={{minHeight:"100vh",background:COLORS.cream}}>
        {/* Sélecteur de guilde si plusieurs */}
        {templates.length > 1 && (
          <div style={{background:COLORS.forest,padding:"8px 10px 0",display:"flex",gap:6,overflowX:"auto"}}>
            {templates.map(function(tpl,idx){
              return (
                <button key={tpl.id} onClick={function(){ setActiveGuild(idx); }}
                  style={{
                    background:idx===activeGuild?COLORS.cream:"rgba(255,255,255,0.1)",
                    color:idx===activeGuild?COLORS.forest:COLORS.mist,
                    border:"none", borderRadius:"8px 8px 0 0", padding:"8px 12px",
                    fontFamily:"sans-serif", fontSize:12, fontWeight:idx===activeGuild?700:400,
                    cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                  }}>
                  {tpl.emoji} {tpl.nom}
                </button>
              );
            })}
          </div>
        )}
        <GuildView
          key={current ? current.id : "single"}
          terrain={terrain}
          parcours={parcours}
          template={current}
          onBack={function(){ setScreen("select"); }}
        />
      </div>
    );
  }

  return <AgentView
    parcours={parcours}
    onGuild={function(data){ setTerrain(data); setScreen("select"); }}
    onBack={function(){ setScreen("landing"); }}
  />;
}
