# Déploiement Phi

## 1. Base Supabase

1. Créer un projet Supabase.
2. Exécuter `supabase_schema.sql` dans le SQL Editor.
3. Créer un bucket public `profile-images`.
4. Copier `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.

## 2. Backend Render

Créer le service depuis `render.yaml` ou configurer manuellement:

- Root directory: `backend`
- Build command: `pip install --upgrade pip && pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health check: `/ping`

Variables obligatoires:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FIREBASE_PROJECT_ID=phi-org`
- `GEMINI_API_KEY`
- `GROQ_API_KEY` optionnel
- `CORS_ORIGINS=https://phi-org.web.app,http://localhost:5173,http://127.0.0.1:5173`
- `FRONTEND_BASE_URL=https://phi-org.web.app`

Ne pas définir `AUTH_ALLOW_TEST_USER=true` en production.

## 3. Frontend Firebase Hosting

Dans `frontend/.env`:

```env
VITE_API_URL=https://votre-api-render.onrender.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=phi-org.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=phi-org
VITE_FIREBASE_STORAGE_BUCKET=phi-org.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Commandes:

```bash
cd frontend
npm install
npm run build
firebase deploy --only hosting
```

## 4. Vérification

- `GET /ping` doit renvoyer `{"status":"ok"}`.
- Connexion Firebase depuis `/auth`.
- Dashboard: lecture du solde crédits.
- Création template: Save puis Publish depuis l’éditeur.
- URL publique: `/p/<slug>`.
- Génération IA: vérifier `GEMINI_API_KEY`, crédits et tables Supabase.
