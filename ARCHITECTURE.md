# Architecture du projet Phi

## Vue d'ensemble

Phi est une plateforme web full-stack de portfolio professionnel et de coaching carriere assiste par IA. Le produit combine:

- un frontend React/Vite/TypeScript avec Tailwind CSS, animations Framer Motion et icones Lucide;
- un backend FastAPI Python expose comme API REST;
- Firebase pour l'authentification cote client, l'analytics et l'hebergement frontend;
- Supabase pour les donnees applicatives, les credits, les portfolios et le stockage d'images;
- Gemini pour les fonctions IA principales, avec un fallback Groq sur la generation de portfolio.

Le parcours principal est le suivant: l'utilisateur s'authentifie avec Firebase, accede a son workspace, consulte ses credits, utilise le Coach IA ou cree un portfolio depuis un template ou via l'IA. Les brouillons de portfolio sont charges dans l'editeur via `localStorage`; les portfolios generes par IA sont aussi sauvegardes en base via le backend.

## Stack technique

### Frontend

- React 18, TypeScript, Vite.
- Tailwind CSS v4 via `@tailwindcss/vite`.
- React Router pour le routage SPA.
- Firebase Auth et Firebase Analytics.
- i18next/react-i18next pour les traductions FR/EN.
- Framer Motion pour les transitions et animations.
- Lucide React pour les icones.
- Firebase Hosting pour le deploiement statique.

### Backend

- Python 3.12.6.
- FastAPI avec Uvicorn.
- Pydantic v2 pour les schemas d'entree.
- Supabase Python client.
- Google Generative AI (`google-generativeai`) pour Gemini.
- `requests` pour le fallback Groq.
- Render pour le deploiement de l'API.

### Donnees et services externes

- Firebase: authentification utilisateur cote frontend, analytics et hosting.
- Supabase: tables `user_credits`, `credit_transactions`, `chat_messages`, `portfolios`, bucket `profile-images`.
- Gemini: chat coach et generation structuree de portfolio.
- Groq: fallback de generation IA si Gemini est indisponible et si `GROQ_API_KEY` est configuree.

## Arborescence utile

```text
.
├── backend/
│   ├── main.py
│   ├── db.py
│   ├── schemas.py
│   ├── requirements.txt
│   ├── runtime.txt
│   ├── test_gen.py
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── i18n.ts
│   │   ├── index.css
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   ├── eslint.config.js
│   ├── firebase.json
│   └── .env.example
├── render.yaml
├── .env.example
├── check_gemini_models.py
├── process_logo.py
├── logo.png
└── README.md
```

Les dossiers generes ou externes (`backend/venv`, `frontend/dist`, caches Firebase, lockfiles volumineux, fichiers `*.tsbuildinfo`) ne sont pas detailles fichier par fichier.

## Architecture backend

Le backend est centre sur `backend/main.py`, qui cree l'application FastAPI, configure le CORS, initialise les fournisseurs IA et expose les routes REST.

### Initialisation

- Charge les variables d'environnement avec `python-dotenv`.
- Configure Gemini si `GEMINI_API_KEY` est presente.
- Detecte Groq si `GROQ_API_KEY` est presente.
- Configure les origines CORS depuis `CORS_ORIGINS`, avec fallback vers Firebase Hosting et Vite local.
- Effectue un diagnostic au demarrage pour verifier Supabase et les variables critiques.

### Acces donnees

`backend/db.py` expose un client Supabase initialise paresseusement:

- `get_supabase()` cree le client uniquement au premier usage.
- `_LazyClient` permet au code existant d'importer `supabase` sans provoquer un crash au demarrage si les variables d'environnement manquent.

### Authentification backend

Le backend verifie maintenant les Firebase ID tokens via l'en-tete `Authorization: Bearer <token>`. La dependance `get_current_user` retourne l'UID Firebase authentifie et protege les routes privees. Un mode local `AUTH_ALLOW_TEST_USER=true` existe uniquement pour le developpement.

### Credits

Le backend gere un solde de credits minimal:

- creation implicite d'un solde de 50 credits si l'utilisateur n'a pas encore de ligne `user_credits`;
- debit de 1 credit par message Coach IA;
- debit de 10 credits par generation IA de portfolio;
- tentative d'enregistrement dans `credit_transactions`.

### Generation IA de portfolio

Le flux `/api/portfolios/generate`:

1. Valide le payload avec `PortfolioGenerateRequest`.
2. Verifie les credits.
3. Construit un prompt JSON strict avec `_build_portfolio_generation_prompt`.
4. Appelle Gemini en premier si disponible.
5. Utilise Groq comme fallback si configure.
6. Extrait et parse un objet JSON meme si le modele renvoie du texte autour.
7. Normalise la structure via `_normalize_generated_portfolio`.
8. Insere une ligne `portfolios` dans Supabase.
9. Met a jour `content_json` avec le brouillon complet.
10. Debite les credits et renvoie le draft au frontend.

## Architecture frontend

Le frontend est une SPA React. `frontend/src/main.tsx` monte l'application et importe les styles globaux et i18n. `frontend/src/App.tsx` compose les providers et definit le routage.

### Providers globaux

- `ThemeProvider` applique `light`, `dark` ou `system` sur le document et persiste le choix en `localStorage`.
- `AuthProvider` ecoute Firebase Auth avec `onAuthStateChanged` et expose `user`, `isLoading` et `signOut`.
- `CookieConsent` affiche une banniere de consentement et stocke le choix en `localStorage`.
- `AnalyticsTracker` envoie les changements de route a Firebase Analytics via `trackPageView`.

### Routage

Les pages sont lazy-loadees:

- `/`: landing page publique.
- `/auth`: connexion/inscription Firebase.
- `/privacy` et `/terms`: pages legales.
- `/dashboard`: espace protege avec layout lateral.
- `/dashboard/coach`: Coach IA.
- `/dashboard/credits`: credits.
- `/dashboard/settings`: parametres.
- `/dashboard/create`: choix du mode de creation.
- `/dashboard/create/template`: creation depuis template.
- `/dashboard/create/ai`: generation IA.
- `/dashboard/editor/:id`: editeur de brouillon.
- `/builder`: placeholder d'un builder IA.
- `/p/:slug`: consultation publique d'un portfolio publie.
- `*`: page 404.

### Gestion API

`frontend/src/lib/api.ts` centralise:

- le calcul de l'URL backend (`VITE_API_URL`, fallback Render en prod, localhost en dev);
- `apiUrl(path)` pour construire les URLs;
- `wakeBackend()` pour reveiller Render free tier via `/ping`;
- `fetchWithTimeout()` pour appliquer un timeout avec `AbortController`.

### Brouillons de portfolio

`frontend/src/lib/portfolioDraft.ts` gere les brouillons locaux:

- definition de templates;
- generation de slug;
- creation d'un `PortfolioDraft` depuis un template;
- sauvegarde et chargement via `localStorage`;
- validation minimale du draft renvoye par `/api/portfolios/generate`.

### Rendu portfolio

`PortfolioRenderer` transforme une structure `PortfolioData` en page consultable. Il sait rendre les sections `hero`, `about`, `projects`, `contact`, `custom` et un fallback generique. Les sections invisibles sont filtrees.

## Flux fonctionnels

### Authentification utilisateur

1. L'utilisateur arrive sur `/auth`.
2. Il se connecte par email/mot de passe ou Google.
3. Firebase Auth maintient la session cote client.
4. Les routes protegees verifient la presence de `user` dans `ProtectedRoute`.
5. Le backend valide le Firebase ID token avant de traiter les routes privees.

### Dashboard et credits

1. `Dashboard` lit l'utilisateur courant.
2. Il appelle `/api/credits/balance?userId=<uid>`.
3. Le backend renvoie le solde existant ou initialise 50 credits.
4. Le dashboard affiche le solde et les acces rapides vers Coach IA et portfolios.

### Coach IA

1. `CoachChat` charge le solde.
2. L'utilisateur envoie un message.
3. Le frontend envoie `userId`, `message` et `history` a `/api/coach/chat`.
4. Le backend verifie les credits, appelle Gemini, debite 1 credit et tente d'enregistrer l'historique.
5. Le frontend affiche la reponse et le nouveau solde.

### Creation depuis template

1. L'utilisateur filtre les templates par domaine dans `CreateFromTemplate`.
2. Il choisit un template, nomme son portfolio et definit le slug/visibilite.
3. `createPortfolioDraft()` fabrique un draft local.
4. `savePortfolioDraft()` l'enregistre dans `localStorage`.
5. L'utilisateur est redirige vers `/dashboard/editor/:id`.

### Generation IA de portfolio

1. `CreateWithAI` collecte le profil en 9 etapes.
2. L'image de profil optionnelle est envoyee a `/api/upload/image`.
3. Le frontend reveille le backend avec `/ping`.
4. Il envoie le payload complet a `/api/portfolios/generate`.
5. Le backend genere, normalise, sauvegarde et renvoie un draft.
6. Le frontend sauvegarde le draft en `localStorage` et ouvre l'editeur.

### Publication et consultation par slug

Le backend expose `/api/portfolios/{portfolio_id}/publish` et `/api/portfolios/by-slug/{slug}`. La page `PortfolioViewer` appelle la route par slug, extrait `content_json` et le rend avec `PortfolioRenderer`. Les boutons Save/Publish de l'editeur sont surtout une interface visuelle pour l'instant.

## API et contrats de donnees

### Endpoints backend

| Methode | Route | Role |
| --- | --- | --- |
| `GET` | `/ping` | Healthcheck Render; renvoie aussi si Gemini est configure. |
| `GET` | `/api/credits/balance` | Renvoie ou initialise le solde de credits d'un utilisateur. |
| `POST` | `/api/upload/image` | Upload image JPEG/PNG/WebP vers Supabase Storage, max 5 MB. |
| `POST` | `/api/coach/chat` | Envoie un message au Coach IA, debite 1 credit et journalise si possible. |
| `POST` | `/api/portfolios/generate` | Genere un portfolio IA, debite 10 credits, sauvegarde et renvoie un draft. |
| `POST` | `/api/portfolios/{portfolio_id}/publish` | Passe un portfolio en `published`, public, et renvoie son URL publique. |
| `POST` | `/api/portfolios` | Cree un portfolio simple depuis payload `PortfolioCreate`. |
| `GET` | `/api/portfolios` | Liste les portfolios de l'utilisateur courant mocke. |
| `GET` | `/api/portfolios/{portfolio_id}` | Recupere un portfolio par id. |
| `PUT` | `/api/portfolios/{portfolio_id}` | Met a jour titre/contenu d'un portfolio si l'utilisateur correspond. |
| `GET` | `/api/portfolios/by-slug/{slug}` | Recupere un portfolio public par slug. |
| `DELETE` | `/api/portfolios/{portfolio_id}` | Supprime un portfolio si l'utilisateur correspond. |

### Schemas Pydantic backend

- `PortfolioCreate`: `title`, `template`, `content_json`.
- `PortfolioUpdate`: mise a jour optionnelle de `title` et `content_json`.
- `ChatMessage`: `role`, `content`.
- `ChatRequest`: `userId`, `message`, `history`.
- `SocialLinks`: liens `linkedin`, `github`, `website`, `behance`.
- `ProjectInput`: `name`, `description`, `url`, `stack`.
- `PortfolioGenerateRequest`: payload complet du wizard IA, incluant identite, contact, reseaux, bio, competences, experiences, projets, services, ton, theme, objectif carriere, audience cible, slug et visibilite.

### Types TypeScript frontend

- `PortfolioMetadata`: titre, description, auteur, favicon optionnelle.
- `PortfolioTheme`: couleurs, police et variante `light`/`dark`.
- `PortfolioLayout`: navigation `sidebar`, `topbar` ou `minimal`.
- `PortfolioSection`: `id`, `type`, `isVisible`, `content`.
- `PortfolioData`: structure rendue par l'editeur et le viewer.
- `TemplateDefinition`: description d'un template local.
- `PortfolioDraft`: extension de `PortfolioData` avec template, slug, visibilite, domaine et timestamps.

## Inventaire par fichier

### Racine

- `.env.example`: liste les variables globales attendues: Supabase, Groq, Gemini, Redis, Vercel, Resend.
- `.gitignore`: exclut les secrets, dependances, builds et caches habituels.
- `README.md`: presentation projet, mais le fichier semble mal decode ou corrompu lors de la lecture depuis PowerShell; a verifier avec le bon encodage.
- `render.yaml`: blueprint Render du service `phi-api`, avec `rootDir: backend`, installation des requirements, demarrage Uvicorn, healthcheck `/ping`, CORS et secrets.
- `check_gemini_models.py`: script utilitaire qui interroge l'API Gemini pour lister les modeles disponibles avec une cle API.
- `process_logo.py`: script PIL qui rend le fond blanc du logo transparent, crop l'image et genere `frontend/public/logo.png` et `favicon.png`.
- `logo.png`: logo source binaire utilise pour generer les assets frontend.
- `PHI_CDC_v2_ZeroBudget 1.pdf` et `PHI_CDC_v2_ZeroBudget.docx`: cahier des charges/documentation produit, non execute par l'application.
- `phi_spec.txt`: specification texte du produit.

### Backend

- `backend/main.py`: coeur de l'API FastAPI; configure CORS, logging, IA, credits, upload image, coach IA, generation portfolio, CRUD portfolios et publication.
- `backend/db.py`: client Supabase paresseux et proxy `supabase` compatible avec les imports existants.
- `backend/schemas.py`: schemas Pydantic utilises par les endpoints de portfolio, chat et generation IA.
- `backend/requirements.txt`: dependances Python figees pour FastAPI, Supabase, Gemini, Uvicorn, HTTP, validation et bibliotheques associees.
- `backend/runtime.txt`: version Python cible Render, `3.12.6`.
- `backend/test_gen.py`: script manuel local qui poste un payload exemple sur `/api/portfolios/generate`.
- `backend/.env.example`: variables backend locales: CORS, Supabase et Gemini.

### Frontend - configuration

- `frontend/package.json`: scripts `dev`, `build`, `lint`, `preview`; dependances React, Firebase, Tailwind, i18n, Framer Motion, Lucide, Router.
- `frontend/index.html`: point d'entree HTML Vite.
- `frontend/vite.config.ts`: configuration Vite avec React, Tailwind CSS et alias `@` vers `src`.
- `frontend/vite.config.js` et `frontend/vite.config.d.ts`: variantes/artefacts de configuration presents dans le depot; la version TypeScript est la source principale lisible.
- `frontend/tsconfig.json`: configuration TypeScript stricte historique pour `src`.
- `frontend/tsconfig.app.json`: configuration TypeScript applicative avec target moderne et types Vite.
- `frontend/tsconfig.node.json`: configuration TypeScript pour fichiers Node/config.
- `frontend/eslint.config.js`: configuration ESLint flat pour TypeScript, React Hooks et React Refresh, ignore `dist`.
- `frontend/firebase.json`: configuration Firebase Hosting, rewrites SPA vers `index.html`, headers de securite et cache long pour assets.
- `frontend/.env.example`: documente `VITE_API_URL` et les origines CORS attendues cote Render.
- `frontend/README.md`: documentation Vite/React du sous-projet frontend.

### Frontend - bootstrap et routage

- `frontend/src/main.tsx`: monte `App` dans `#root`, active `StrictMode`, importe CSS global et i18n.
- `frontend/src/App.tsx`: configure providers globaux, routes lazy-loadees, routes protegees et tracking analytics.
- `frontend/src/vite-env.d.ts`: declarations de types Vite.
- `frontend/src/i18n.ts`: dictionnaire FR/EN et initialisation i18next; contient la majorite des libelles produit.
- `frontend/src/index.css`: Tailwind CSS v4, theme global, variantes dark mode, classe `glass-bento` et animation de fond etoile.

### Frontend - contextes et bibliotheques

- `frontend/src/contexts/AuthContext.tsx`: contexte Firebase Auth, expose l'utilisateur courant, l'etat de chargement et la deconnexion.
- `frontend/src/lib/api.ts`: helper d'URL backend, reveil Render et fetch avec timeout.
- `frontend/src/lib/firebase.ts`: initialise Firebase App et Analytics; expose `app` et `trackPageView`.
- `frontend/src/lib/portfolioDraft.ts`: templates, slugification, creation/sauvegarde/chargement de brouillons portfolio en `localStorage`.
- `frontend/src/types/portfolio.ts`: types de donnees partages par l'editeur, le renderer et le viewer.

### Frontend - composants

- `frontend/src/components/ThemeProvider.tsx`: provider de theme avec persistance locale.
- `frontend/src/components/CookieConsent.tsx`: banniere cookies/analytics avec acceptation/refus stocke en `localStorage`.
- `frontend/src/components/PortfolioRenderer.tsx`: renderer de portfolio depuis `PortfolioData`.
- `frontend/src/components/Layout/DashboardLayout.tsx`: layout dashboard avec sidebar desktop, menu mobile, topbar, navigation, theme toggle et outlet.

### Frontend - pages

- `frontend/src/pages/LandingPage.tsx`: page marketing publique avec hero, sections produit, templates, tarifs credits, CTA et footer.
- `frontend/src/pages/AuthPage.tsx`: connexion/inscription Firebase email/password et Google SSO, acceptation des conditions a l'inscription.
- `frontend/src/pages/Dashboard.tsx`: accueil workspace, recuperation des credits et cartes d'acces vers Coach IA et creation portfolio.
- `frontend/src/pages/CreateChoice.tsx`: choix entre generation IA et creation depuis template.
- `frontend/src/pages/CreateFromTemplate.tsx`: wizard template; filtre par domaine, preview modale, creation du draft local.
- `frontend/src/pages/CreateWithAI.tsx`: wizard IA en 9 etapes; upload image, payload backend, reveil Render, gestion erreurs et redirection editeur.
- `frontend/src/pages/CoachChat.tsx`: interface conversationnelle du Coach IA; envoie historique et message au backend.
- `frontend/src/pages/EditorLayout.tsx`: editeur/preview de brouillon; sidebar sections/theme/settings, preview desktop/mobile, UI Save/Publish.
- `frontend/src/pages/Builder.tsx`: placeholder d'un builder IA split-screen.
- `frontend/src/pages/PortfolioViewer.tsx`: page publique `/p/:slug`; charge un portfolio depuis l'API et le rend.
- `frontend/src/pages/Credits.tsx`: page credits avec solde et transactions simulees, packs de recharge UI.
- `frontend/src/pages/Settings.tsx`: profil utilisateur Firebase en lecture seule, langue, deconnexion et UI suppression compte.
- `frontend/src/pages/Privacy.tsx`: politique de confidentialite bilingue selon la langue courante.
- `frontend/src/pages/Terms.tsx`: conditions d'utilisation bilingues selon la langue courante.
- `frontend/src/pages/NotFound.tsx`: page 404.

### Assets frontend

- `frontend/public/logo.svg`, `logo.png`, `logo-dark.png`: logos publics utilises dans la navigation et l'UI.
- `frontend/public/favicon.*`: favicons.
- `frontend/public/mock1.png`, `mock2.png`, `mock3.png`: apercus visuels de portfolios sur la landing page.
- `frontend/public/og-image.png`: image Open Graph.
- `frontend/public/icons.svg`: sprite ou collection d'icones publiques.
- `frontend/public/robots.txt` et `sitemap.xml`: fichiers SEO.
- `frontend/src/assets/react.svg`, `vite.svg`, `hero.png`: assets source Vite/React ou image hero, peu connectes au flux principal actuel.

## Deploiement et configuration

### Backend Render

`render.yaml` decrit un service web Python gratuit:

- nom: `phi-api`;
- root: `backend`;
- build: upgrade pip puis `pip install -r requirements.txt`;
- start: `uvicorn main:app --host 0.0.0.0 --port $PORT`;
- healthcheck: `/ping`;
- variables: `CORS_ORIGINS`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_BASE_URL`.

### Frontend Firebase Hosting

`frontend/firebase.json` sert `dist`, redirige toutes les routes vers `index.html` pour la SPA et ajoute des headers de securite. Les assets statiques JS/CSS/images ont un cache long.

### Variables d'environnement

- Frontend: `VITE_API_URL` permet de pointer vers Render ou localhost.
- Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `CORS_ORIGINS`, `FRONTEND_BASE_URL`.
- Les cles Firebase sont dans `frontend/src/lib/firebase.ts`; c'est normal pour une configuration client Firebase, mais les regles et restrictions Firebase doivent rester configurees cote console.

## Points d'attention

- L'authentification backend depend de `FIREBASE_PROJECT_ID` et des certificats publics Google; `AUTH_ALLOW_TEST_USER=true` doit rester reserve au developpement local.
- Certaines pages utilisent encore des donnees simulees: credits dans `Credits`, historique de transactions, et quelques labels fixes comme `50 CR` dans le layout.
- `README.md` semble mal decode ou corrompu lors de la lecture PowerShell; il faut verifier son encodage avant de l'utiliser comme source.
- `frontend/src/lib/firebase.ts` contient la configuration Firebase cote client et est importe par `AuthContext`, `AuthPage` et `App`.
- Les boutons Save/Publish de `EditorLayout` appellent maintenant les endpoints backend de sauvegarde et publication.
- `CreateChoice` affiche `2 CR` pour le template, tandis que d'autres textes et le backend indiquent plutot 5 credits pour un portfolio template.
- `PortfolioRenderer` rend les portfolios de maniere generique; il n'applique pas encore toute la personnalisation de `theme` et `layout`.
- La generation IA demande un JSON strict, mais le backend prevoit deja extraction et normalisation pour tolerer une reponse modele imparfaite.
- Le fallback Groq utilise le modele `mixtral-8x7b-32768`; il doit etre verifie selon la disponibilite actuelle du fournisseur avant production.

## Fichiers exclus de l'analyse detaillee

Les elements suivants existent ou peuvent exister dans le depot, mais ne sont pas detailles fichier par fichier car ils sont generes, externes, volumineux ou non applicatifs:

- `backend/venv/`: environnement virtuel Python et dependances installees.
- `frontend/dist/`: build Vite genere.
- `frontend/.firebase/`: cache Firebase Hosting.
- `frontend/.agents/`: ressources d'agents/skills externes au code produit.
- `frontend/package-lock.json`: lockfile npm volumineux.
- `frontend/skills-lock.json`: lockfile de skills.
- `frontend/*.tsbuildinfo`: caches TypeScript.
- Images binaires (`*.png`, `*.ico`) et documents (`*.pdf`, `*.docx`) au-dela de leur role fonctionnel.
