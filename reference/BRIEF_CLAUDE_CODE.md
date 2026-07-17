# Brief de démarrage — PlantExpert Québec

> **À lire par Claude Code.** Ce document décrit un projet à construire depuis zéro.
> L'utilisateur (Pierre-Luc) débute avec Next.js — explique tes étapes clairement,
> avance par petits paliers testables, et vérifie que chaque étape fonctionne avant
> de passer à la suivante. Un prototype React fonctionnel est fourni comme référence
> (`plantexpert-full.jsx`) : sers-t'en pour porter la logique, ne réinvente rien.

---

## 1. Le produit en une phrase

Une application web qui aide les propriétaires terriens du Québec à concevoir un
aménagement en permaculture : un agent conversationnel diagnostique leur terrain,
puis l'app génère des **guildes végétales** sur-mesure (combinaisons de plantes qui
se soutiennent mutuellement), adaptées à leur zone de rusticité et leurs objectifs.

L'app est un **entonnoir de génération de leads** pour une entreprise d'aménagement :
l'utilisateur fait son projet gratuitement, et l'entreprise récupère un brief complet
qualifié pour le relancer.

## 2. Les 3 parcours utilisateur

L'utilisateur choisit son profil au départ ; tout le reste s'adapte :

- **🌱 Débutant** — « Guide-moi de A à Z » → diagnostic complet + design + CTA
  « réserver un accompagnement clé en main »
- **🌿 Intermédiaire** — « Aide-moi par bouts » → diagnostic + design + CTA
  « choisir des services à la carte » (rencontre-conseil, plan, plantation)
- **🌳 Expert** — « Je fais tout moi-même » → parcours raccourci, va droit à la liste
  de végétaux + quantités + CTA « commander mes végétaux »

## 3. Le flux complet

1. **Écran d'accueil** — choix du parcours
2. **Agent conversationnel** (Sylvie) — diagnostic du terrain en 5 phases :
   profil → localisation → terrain → contraintes → vision. Sylvie pose une question
   à la fois, s'adapte aux réponses, et termine en produisant un JSON structuré du terrain.
3. **Sélection des guildes** — l'IA recommande 1 à 3 guildes-modèles adaptées
   (selon zone + objectifs + superficie). L'utilisateur peut en ajouter/retirer.
4. **Génération des guildes** — chaque guilde part d'un modèle éprouvé puis est
   adaptée aux conditions réelles. Affichage en onglets : Plan (canvas spatial),
   Profil (coupe par strates), Plantes (liste + quantités), Rapport (estimation + PDF).
5. **Capture du lead** — courriel + prénom → sauvegarde en base.

## 4. Concept clé : les guildes-modèles hybrides

Le cœur différenciateur. On **ne génère pas** une guilde à 100 % par IA (trop
imprévisible). On part de **recettes éprouvées** (les guildes-modèles) que l'IA
**adapte** au terrain réel. C'est plus fiable et ça reflète la vraie expertise terrain.

5 modèles existent déjà dans le prototype (`GUILD_TEMPLATES`), organisés selon 3 axes :
- **arbre central** : Guilde du pommier
- **objectif** : Haie brise-vent nourricière, Coin des pollinisateurs
- **milieu** : Bande riveraine productive, Verger de terrain sec

Chaque modèle définit des **rôles à remplir** (arbre-central, fixateur-azote,
petit-fruit, accumulateur, pollinisateur, couvre-sol, riveraine, canopée), et l'IA
choisit la meilleure espèce pour chaque rôle selon le terrain.

## 5. Filtrage par zone de rusticité

Chaque plante a une `zoneMin` (zone de rusticité minimale). Quand un client est en
zone 3, l'IA ne reçoit QUE les plantes compatibles (`zoneMin <= 3`). Ce filtrage se
fait AVANT d'envoyer le prompt à l'IA. Voir `plantsForZone()` et `zoneToNumber()`
dans le prototype.

## 6. La base de données de plantes

Le prototype contient 21 espèces (5 fruitiers, 13 indigènes, + accumulateurs et
pollinisateurs). Chaque plante a : `nom, latin, emoji, zoneMin, zone, indigene,
forme, hauteur [min,max], espacement, sol[], lumiere, eau, fonctions[], strate,
roleGuilde, orientation_preferee, couleur, prix, ecologie`.

**Priorité produit : cette base doit grandir à 100+ espèces.** C'est le fossé
concurrentiel. Sources de données à privilégier (déjà validées légalement) :
- **VASCAN / Canadensys** (CC0/CC-BY-SA) — fondation taxonomique, libre commercialement
- **USDA PLANTS** (domaine public US) — attributs écologiques
- Descriptions **auto-rédigées** pour la propriété pleine du contenu
- ❌ **Exclure PFAF** (CC BY-NC-SA, incompatible commercial)

## 7. Stack technique confirmée

- **Next.js 14** (App Router) + **TypeScript strict**
- **Tailwind CSS** — mobile-first obligatoire
- **Supabase** (PostgreSQL) — base de données, auth, stockage de photos
- **Prisma** — ORM
- **Vercel** — déploiement
- **API Anthropic** (claude-sonnet-4-6) pour l'agent et la génération de guildes.
  ⚠️ Les appels se font côté **serveur** (route API / server action), jamais depuis
  le navigateur avec une clé exposée. C'est différent du prototype (qui utilisait
  l'API intégrée aux artifacts).

## 8. Architecture — séparation stricte des couches

```
src/
├── app/                      # Routing (UI uniquement)
│   ├── page.tsx              # Écran choix du parcours
│   ├── diagnostic/           # Agent conversationnel
│   ├── guildes/              # Sélection + affichage des guildes
│   └── api/                  # Routes serveur (appels IA, sauvegarde leads)
│       ├── chat/             # Endpoint agent Sylvie
│       └── guilde/           # Endpoint génération de guilde
├── components/               # UI pure, aucune logique métier
├── lib/                      # Logique métier
│   ├── plants.ts             # Base de plantes + helpers de filtrage
│   ├── guilds.ts             # Guildes-modèles + logique de recommandation
│   └── prompts.ts            # Construction des prompts IA
├── db/                       # Accès données (Prisma)
└── types/                    # Types partagés
```

## 9. Ce que Claude Code doit faire, dans l'ordre

**Palier 1 — Squelette Next.js qui tourne**
1. `npx create-next-app@latest` avec TypeScript, Tailwind, App Router, dossier `src/`
2. Lancer `npm run dev` et confirmer que la page d'accueil s'affiche sur localhost:3000
3. Créer la page d'accueil avec les 3 cartes de parcours (design du prototype)

**Palier 2 — Porter les données et la logique**
4. Créer `lib/plants.ts` avec les 21 plantes du prototype (+ structure prête à grandir)
5. Créer `lib/guilds.ts` avec les 5 guildes-modèles et les helpers de zone
6. Créer `lib/prompts.ts` avec les fonctions de construction de prompts

**Palier 3 — L'agent côté serveur**
7. Créer la route API `/api/chat` qui appelle l'API Anthropic côté serveur
   (clé dans `.env.local`, jamais exposée au navigateur)
8. Porter l'interface de chat de Sylvie (composant client qui appelle `/api/chat`)

**Palier 4 — Guildes**
9. Route `/api/guilde` pour recommandation + génération
10. Porter l'écran de sélection des guildes et l'affichage (Plan/Profil/Plantes/Rapport)

**Palier 5 — Base de données (voir section 10)**
11. Mettre en place Supabase + Prisma, table `leads` + `terrain_profiles`
12. Sauvegarder chaque diagnostic complété

**Palier 6 — Déploiement**
13. Pousser sur GitHub, connecter à Vercel, déployer

> Après CHAQUE palier, vérifie que l'app tourne toujours avant de continuer.
> Explique à Pierre-Luc ce qu'il doit voir à l'écran à chaque étape.

## 10. Mise en place de Supabase — pas à pas (pour débutant)

Quand vous arrivez au Palier 5, guide Pierre-Luc ainsi :

1. **Créer un compte** sur https://supabase.com (gratuit). Cliquer « New Project ».
2. Choisir un nom (ex. `plantexpert`), un mot de passe de base de données (le noter),
   et une région proche (ex. `Canada Central` ou `East US`).
3. Une fois le projet créé, aller dans **Project Settings → API** pour récupérer :
   - le `Project URL`
   - la clé `anon public`
   - la clé `service_role` (secrète — côté serveur seulement)
4. Aller dans **Project Settings → Database** pour récupérer la `Connection string`
   (mode « URI ») — c'est ce que Prisma utilisera.
5. Mettre ces valeurs dans `.env.local` (jamais commité sur GitHub) :
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   DATABASE_URL=...
   ANTHROPIC_API_KEY=...
   ```
6. `npm install prisma @prisma/client`, puis `npx prisma init`
7. Définir le schéma (tables `leads`, `terrain_profiles`), puis `npx prisma migrate dev`
8. Pour le stockage des photos de terrain : créer un **bucket** Supabase Storage
   nommé `terrains` (privé), utilisé plus tard pour la visualisation temporelle.

Explique à chaque étape POURQUOI on fait ça, pas juste comment.

## 11. Sur l'horizon (ne pas construire maintenant, mais garder en tête)

- **Visualisation temporelle** : photo du terrain uploadée en arrière-plan +
  silhouettes de plantes semi-transparentes qui grossissent selon l'âge (5/10/15/20
  ans), calculées depuis `hauteur`, `espacement` et le taux de croissance de chaque
  espèce. C'est la future signature du produit. L'infrastructure (Supabase Storage
  pour la photo) se met en place au Palier 5 pour préparer le terrain.
- Dashboard admin pour voir les leads
- Calendrier vivant (floraison/récolte/taille sur 12 mois)
- Estimation de rendement et de services écologiques

## 12. Design system

- Palette botanique : forêt `#1A3A2A`, mousse `#2D5A3D`, sauge `#4A7A5A`,
  fougère `#6B9E7A`, crème `#F7F4EE`, écorce `#8B6B4A`, ambre `#C4842A`
- Typographie : Playfair Display (titres) + un sans-serif propre (corps) + mono (données)
- Épuré, inspiré de la nature, mobile-first, sans surcharge visuelle

---

**Fichier de référence fourni** : `plantexpert-full.jsx` contient tout le prototype
fonctionnel (données, prompts, composants, logique). Porte-le proprement vers la
structure Next.js ci-dessus. Ne copie pas les `fetch` vers l'API Anthropic tels quels :
ils doivent passer par des routes serveur.
