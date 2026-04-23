from typing import Optional
import logging
import traceback

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uuid
import json
import re
from datetime import datetime, timezone

import google.generativeai as genai

load_dotenv()

from db import supabase, get_supabase
from schemas import PortfolioCreate, PortfolioUpdate, ChatRequest, PortfolioGenerateRequest

# --- Logging ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("phi-api")

AI_PORTFOLIO_CREDIT_COST = 10
ALLOWED_SECTION_TYPES = frozenset({"hero", "about", "gallery", "contact", "projects", "custom"})

# Initialize Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini API key loaded (length=%d)", len(GEMINI_API_KEY))
else:
    logger.warning("GEMINI_API_KEY is NOT set — AI features will fail")

app = FastAPI(title="Phi API")


@app.on_event("startup")
def startup_diagnostics():
    """Log configuration status on startup to ease debugging on Render."""
    logger.info("=== Phi API starting ===")
    logger.info("SUPABASE_URL set: %s", bool(os.getenv("SUPABASE_URL")))
    logger.info("SUPABASE_SERVICE_ROLE_KEY set: %s", bool(os.getenv("SUPABASE_SERVICE_ROLE_KEY")))
    logger.info("GEMINI_API_KEY set: %s", bool(GEMINI_API_KEY))
    logger.info("CORS_ORIGINS: %s", os.getenv("CORS_ORIGINS", "(default)"))
    # Eagerly test Supabase connection
    try:
        get_supabase()
        logger.info("Supabase client: OK")
    except Exception as e:
        logger.error("Supabase client FAILED: %s", e)


def _cors_allow_origins() -> list[str]:
    """Liste depuis CORS_ORIGINS (virgules)."""
    default = (
        "https://phi-org.web.app,"
        "https://phi-org.firebaseapp.com,"
        "http://localhost:5173,http://127.0.0.1:5173"
    )
    raw = os.getenv("CORS_ORIGINS", default).strip()
    if raw == "*":
        return ["*"]
    # Nettoyage rigoureux des origines
    origins = [o.strip().rstrip("/") for o in raw.split(",") if o.strip()]
    return origins if origins else ["*"]


_origins = _cors_allow_origins()
_credentials = False if "*" in _origins else True

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.middleware("http")
async def log_origin_middleware(request, call_next):
    origin = request.headers.get("origin")
    if origin:
        logger.info("Incoming request from origin: %s", origin)
    response = await call_next(request)
    return response

# --- Authentication Mock ---
def get_current_user(user_id: str = "test-user-id"):
    return user_id


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


# --- User Synchronization Helper ---
def _ensure_user_exists(user_id: str, email: str = None, full_name: str = None):
    """
    Désactivé car la table 'users' est absente ou gérée par Firebase.
    """
    pass

def _get_credit_balance(user_id: str) -> int:
    try:
        res = supabase.table("user_credits").select("balance").eq("user_id", user_id).execute()
        if not res.data:
            supabase.table("user_credits").insert({"user_id": user_id, "balance": 50}).execute()
            return 50
        return int(res.data[0]["balance"])
    except Exception as e:
        print(f"credit balance error: {e}")
        return 50


def _debit_credits(user_id: str, current_balance: int, amount: int, description: str) -> int:
    new_balance = current_balance - amount
    supabase.table("user_credits").update({"balance": new_balance}).eq("user_id", user_id).execute()
    try:
        supabase.table("credit_transactions").insert(
            {"user_id": user_id, "amount": -amount, "description": description}
        ).execute()
    except Exception as e:
        print(f"credit_transactions log: {e}")
    return new_balance


def _build_portfolio_generation_prompt(req: PortfolioGenerateRequest) -> str:
    projects_txt = "\n".join(
        f"- {p.name}: {p.description} (url: {p.url or 'n/a'}, stack: {p.stack or 'n/a'})"
        for p in req.projects
    ) or "(aucun projet listé — propose 2 projets fictifs crédibles basés sur le profil, clairement marqués comme exemples à remplacer)"

    social = req.social.model_dump(exclude_none=True)
    social_txt = json.dumps(social, ensure_ascii=False) if social else "{}"

    skills_txt = ", ".join(req.skills) if req.skills else "(non précisées)"
    experiences_txt = "\n".join([f"- {e}" for e in req.experiences]) if req.experiences else "(non précisées)"
    
    services_instruction = ""
    if req.ai_propose_services:
        services_instruction = f"IMPORTANT: Propose une liste de 3 à 5 services professionnels pertinents basés sur les compétences suivantes : {skills_txt}. "
    elif req.services:
        services_instruction = f"Services à inclure : {', '.join(req.services)}. "

    return f"""Tu es un expert en portfolios web professionnels et en copywriting carrière.
À partir des informations utilisateur ci-dessous, produis UN SEUL objet JSON valide (sans markdown, sans texte autour) avec cette structure exacte :
{{
  "metadata": {{
    "title": string (titre du site, accrocheur),
    "description": string (meta description SEO, 150-160 caractères),
    "author": string (nom affiché)
  }},
  "theme": {{
    "primaryColor": string (hex, ex: "#4f46e5"),
    "secondaryColor": string (hex),
    "fontFamily": string (ex: "Inter", "DM Sans", "Space Grotesk"),
    "variant": "light" ou "dark" (doit correspondre à la préférence utilisateur: {req.theme_variant})
  }},
  "layout": {{
    "navigation": "topbar" | "sidebar" | "minimal" (choisis ce qui colle au domaine et au ton)
  }},
  "sections": [
    {{
      "id": string (unique kebab-case),
      "type": "hero" | "about" | "projects" | "contact" | "gallery" | "custom",
      "isVisible": true,
      "content": object (champs riches selon le type)
    }}
  ],
  "seo": {{
    "title": string,
    "description": string
  }},
  "deploy_readiness": {{
    "summary": string (1 phrase: ce qui est prêt pour une mise en ligne),
    "checklist": string[] (3 à 6 actions concrètes avant déploiement: images, domaine, etc.)
  }}
}}

Règles pour "content" des sections :
- hero: headline, subheadline, ctaPrimary, ctaSecondary (optionnel), tags (liste de mots-clés)
- about: title, body (2-4 paragraphes, ton {req.tone}), highlights (liste de 4-6 puces courtes)
- projects: title, intro (phrase), items: [{{ "name": "...", "description": "...", "url": "...", "tags": [] }}] — au moins 2 items (réels si fournis, sinon exemples à personnaliser)
- contact: title, email, phone, whatsapp, location, links: [{{ "label": "...", "url": "..." }}]
- custom: peut être utilisé pour "Services", "Compétences" ou "Expériences". 
  Exemple pour Services: {{ "title": "Mes Services", "items": [{{ "title": "Nom du service", "description": "Détails" }}] }}
  Exemple pour Compétences: {{ "title": "Compétences", "skills": ["React", "Python"] }}

{services_instruction}

Domaine métier (slug): {req.domain}
Ton rédactionnel: {req.tone}
Objectif carrière: {req.career_goal}
Public cible: {req.target_audience or "recruteurs et clients"}
Indication couleur accent (si fournie): {req.accent_color_hint or "aucune — choisis une palette cohérente"}

INFORMATIONS UTILISATEUR
Nom: {req.full_name}
Titre / rôle: {req.professional_title}
Email: {req.email or "non fourni"}
Téléphone: {req.phone or "non fourni"}
WhatsApp: {req.whatsapp or "non fourni"}
Localisation: {req.location or "non fournie"}
Bio / parcours: {req.bio}
Compétences: {skills_txt}
Expériences:
{experiences_txt}
Années d'expérience: {req.years_experience if req.years_experience is not None else "non précisé"}
Projets fournis:
{projects_txt}

Le champ metadata.author must be "{req.full_name}".
Le contenu doit être en français professionnel sauf si le profil indique clairement une audience anglophone.
"""


def _normalize_generated_portfolio(data: dict, req: PortfolioGenerateRequest) -> dict:
    """Assure la cohérence minimale avec le schéma attendu par le frontend."""
    meta = data.get("metadata") or {}
    meta.setdefault("title", req.title)
    meta.setdefault("description", meta.get("title", req.title)[:160])
    meta.setdefault("author", req.full_name)

    theme = data.get("theme") or {}
    theme.setdefault("primaryColor", "#4f46e5")
    theme.setdefault("secondaryColor", "#f8fafc")
    theme.setdefault("fontFamily", "Inter")
    theme.setdefault("variant", req.theme_variant if req.theme_variant in ("light", "dark") else "light")

    layout = data.get("layout") or {}
    nav = layout.get("navigation", "topbar")
    if nav not in ("sidebar", "topbar", "minimal"):
        nav = "topbar"
    layout = {"navigation": nav}

    raw_sections = data.get("sections")
    if not isinstance(raw_sections, list) or not raw_sections:
        raw_sections = [
            {
                "id": "hero-main",
                "type": "hero",
                "isVisible": True,
                "content": {
                    "headline": req.professional_title,
                    "subheadline": req.bio[:280] + ("…" if len(req.bio) > 280 else ""),
                    "ctaPrimary": "Me contacter",
                    "tags": [req.domain, "Portfolio"],
                },
            }
        ]

    sections = []
    for i, sec in enumerate(raw_sections):
        if not isinstance(sec, dict):
            continue
        stype = sec.get("type", "custom")
        if stype not in ALLOWED_SECTION_TYPES:
            stype = "custom"
        sid = sec.get("id") or f"section-{i+1}"
        sid = re.sub(r"[^a-zA-Z0-9_-]", "-", str(sid))[:64]
        sections.append(
            {
                "id": sid,
                "type": stype,
                "isVisible": bool(sec.get("isVisible", True)),
                "content": sec.get("content") if isinstance(sec.get("content"), dict) else {},
            }
        )

    seo = data.get("seo") if isinstance(data.get("seo"), dict) else {}
    deploy = data.get("deploy_readiness") if isinstance(data.get("deploy_readiness"), dict) else {}

    return {
        "metadata": meta,
        "theme": theme,
        "layout": layout,
        "sections": sections,
        "seo": seo,
        "deploy_readiness": deploy,
    }


def _draft_from_core(portfolio_id: str, req: PortfolioGenerateRequest, core: dict) -> dict:
    now = _iso_now()
    return {
        "id": portfolio_id,
        "templateId": "ai",
        "templateName": "Génération IA Phi",
        "slug": req.slug,
        "visibility": req.visibility,
        "domain": req.domain,
        "createdAt": now,
        "updatedAt": now,
        "metadata": core["metadata"],
        "theme": core["theme"],
        "layout": core["layout"],
        "sections": core["sections"],
        "seo": core.get("seo", {}),
        "deploy_readiness": core.get("deploy_readiness", {}),
    }

# --- Ping ---
@app.get("/ping")
def ping():
    return {"status": "ok", "gemini": bool(GEMINI_API_KEY)}

# --- CREDITS API ---
@app.get("/api/credits/balance")
def get_credit_balance(userId: Optional[str] = Query(default=None)):
    """Solde crédits ; passez userId (UID Firebase) depuis le frontend."""
    uid = userId or "test-user-id"
    try:
        res = supabase.table("user_credits").select("balance").eq("user_id", uid).execute()
        if not res.data:
            new_credits = {"user_id": uid, "balance": 50}
            supabase.table("user_credits").insert(new_credits).execute()
            return {"balance": 50}
        return {"balance": res.data[0]["balance"]}
    except Exception as e:
        print(f"Db error: {e}")
        return {"balance": 50}

# --- COACH IA API ---
@app.post("/api/coach/chat")
def coach_chat(request: ChatRequest):
    user_id = request.userId or "test-user-id"
    
    # Synchronisation
    _ensure_user_exists(user_id)
    
    # 1. Vérifier les crédits
    try:
        credits_res = supabase.table("user_credits").select("balance").eq("user_id", user_id).execute()
        balance = credits_res.data[0]["balance"] if credits_res.data else 50
    except:
        balance = 50
        
    if balance < 1:
        raise HTTPException(status_code=403, detail="Crédits insuffisants")
    
    # 2. IA Processing (Gemini 2.5 Flash)
    if not GEMINI_API_KEY:
         answer = "Clé API Gemini non configurée ! Je ne peux pas vous répondre pour l'instant."
    else:
        try:
            model = genai.GenerativeModel('gemini-flash-latest')
            
            # Format history for Gemini
            messages = [{"role": "user", "parts": ["Tu es le Coach IA de Phi. Tu aides l'utilisateur pour sa carrière, son CV, et des simulations d'entretiens."]}]
            
            for msg in request.history:
                # Map role to Gemini's expected formats ("user" or "model")
                role = "model" if msg.role == "assistant" else "user"
                messages.append({"role": role, "parts": [msg.content]})
            
            messages.append({"role": "user", "parts": [request.message]})
            
            response = model.generate_content(messages)
            answer = response.text
        except Exception as e:
            print(f"Gemini API Error: {e}")
            raise HTTPException(status_code=500, detail="Erreur lors de la communication avec l'IA")

    # 3. Déduire 1 crédit
    try:
        supabase.table("user_credits").update({"balance": balance - 1}).eq("user_id", user_id).execute()
        
        # Log de transaction (optional, ignore errors if it fails)
        supabase.table("credit_transactions").insert({
            "user_id": user_id,
            "amount": -1,
            "description": "Message Coach IA"
        }).execute()
        
        # Save message in history (optional)
        supabase.table("chat_messages").insert([
            {"user_id": user_id, "role": "user", "content": request.message},
            {"user_id": user_id, "role": "assistant", "content": answer}
        ]).execute()
    except Exception as e:
         print(f"Error logging db transactions: {e}")

    return {"response": answer, "credits_remaining": balance - 1}


# --- Génération portfolio IA ---
@app.post("/api/portfolios/generate")
def generate_portfolio_ai(req: PortfolioGenerateRequest):
    try:
        user_id = req.userId or "test-user-id"
        
        # Synchronisation utilisateur Firebase -> Supabase
        _ensure_user_exists(user_id, req.email, req.full_name)
        
        balance = _get_credit_balance(user_id)
        if balance < AI_PORTFOLIO_CREDIT_COST:
            raise HTTPException(
                status_code=403,
                detail=f"Crédits insuffisants ({AI_PORTFOLIO_CREDIT_COST} requis pour une génération IA)",
            )

        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=503,
                detail="Clé API Gemini non configurée sur le serveur",
            )

        prompt = _build_portfolio_generation_prompt(req)
        logger.info("Generating portfolio for user=%s slug=%s domain=%s", user_id, req.slug, req.domain)

        import time

        MAX_RETRIES = 3
        RETRY_WAIT = 20  # seconds — Gemini free tier resets per-minute quotas

        raw_text = ""
        parsed = None
        last_error = None

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                model = genai.GenerativeModel("gemini-flash-latest")
                response = model.generate_content(
                    prompt,
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.65,
                    ),
                    request_options={"timeout": 120},
                )

                # Safety check — Gemini may block content
                if not response.parts:
                    block_reason = getattr(response.prompt_feedback, "block_reason", "unknown")
                    logger.warning("Gemini response blocked: %s", block_reason)
                    raise HTTPException(
                        status_code=422,
                        detail=f"L'IA a refusé de générer le contenu (raison: {block_reason}). Reformulez votre bio ou objectif.",
                    )

                raw_text = (response.text or "").strip()
                logger.info("Gemini raw response length: %d chars (attempt %d)", len(raw_text), attempt)

                if not raw_text:
                    raise HTTPException(status_code=502, detail="L'IA a renvoyé une réponse vide")

                parsed = json.loads(raw_text)
                break  # Success — exit retry loop

            except HTTPException:
                raise
            except json.JSONDecodeError as e:
                logger.error("Portfolio AI JSON parse error: %s — raw[:500]: %s", e, raw_text[:500])
                raise HTTPException(status_code=502, detail="Réponse IA invalide (JSON). Réessayez.")
            except Exception as e:
                last_error = e
                err_str = str(e).lower()
                is_rate_limit = "429" in err_str or "resourceexhausted" in err_str or "quota" in err_str
                if is_rate_limit and attempt < MAX_RETRIES:
                    logger.warning("Gemini rate-limited (attempt %d/%d). Retrying in %ds…", attempt, MAX_RETRIES, RETRY_WAIT)
                    time.sleep(RETRY_WAIT)
                    continue
                logger.error("Portfolio AI Gemini error (attempt %d): %s\n%s", attempt, e, traceback.format_exc())
                raise HTTPException(status_code=502, detail=f"Erreur IA: {type(e).__name__}: {e}")

        if not isinstance(parsed, dict):
            logger.error("Gemini returned non-dict: %s", type(parsed))
            raise HTTPException(status_code=502, detail="Format de réponse IA inattendu")

        core = _normalize_generated_portfolio(parsed, req)

        row = {
            "user_id": user_id,
            "title": req.title,
            "template": "ai",
            "content_json": {"pending": True},
            "slug": req.slug[:48],
            "status": "draft",
        }

        try:
            ins = supabase.table("portfolios").insert(row).execute()
            if not ins.data:
                raise HTTPException(status_code=500, detail="Échec enregistrement portfolio")
            portfolio_id = str(ins.data[0]["id"])
        except HTTPException:
            raise
        except Exception as e:
            print(f"Portfolio insert error: {e}")
            raise HTTPException(status_code=500, detail="Erreur base de données lors de la sauvegarde")

        draft = _draft_from_core(portfolio_id, req, core)
        try:
            supabase.table("portfolios").update({"content_json": draft}).eq("id", portfolio_id).execute()
        except Exception as e:
            print(f"Portfolio content update error: {e}")
            raise HTTPException(status_code=500, detail="Erreur lors de l'enregistrement du contenu généré")

        new_balance = _debit_credits(
            user_id,
            balance,
            AI_PORTFOLIO_CREDIT_COST,
            "Génération portfolio IA",
        )

        return {
            "portfolio_id": portfolio_id,
            "credits_remaining": new_balance,
            "draft": draft,
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error("CRITICAL ERROR in generate_portfolio_ai: %s\n%s", e, traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")


# --- CRUD Portfolios ---
@app.post("/api/portfolios")
def create_portfolio(portfolio: PortfolioCreate, user_id: str = Depends(get_current_user)):
    # Déduire crédits (10 credits for AI generated, 5 for template)
    cost = 10 if portfolio.template == "ai" else 5
    
    try:
        credits_res = supabase.table("user_credits").select("balance").eq("user_id", user_id).execute()
        balance = credits_res.data[0]["balance"] if credits_res.data else 50
        if balance < cost:
             raise HTTPException(status_code=403, detail="Crédits insuffisants")
             
        supabase.table("user_credits").update({"balance": balance - cost}).eq("user_id", user_id).execute()
        supabase.table("credit_transactions").insert({
            "user_id": user_id, "amount": -cost,
            "description": f"Génération Portfolio ({portfolio.template})"
        }).execute()
    except Exception as e:
         pass
         
    data = {
        "user_id": user_id,
        "title": portfolio.title,
        "template": portfolio.template,
        "content_json": portfolio.content_json or {},
        "slug": uuid.uuid4().hex[:8],
        "status": "draft"
    }
    result = supabase.table("portfolios").insert(data).execute()
    return result.data[0]

@app.get("/api/portfolios")
def list_portfolios(user_id: str = Depends(get_current_user)):
    result = supabase.table("portfolios").select("*").eq("user_id", user_id).execute()
    return result.data

@app.get("/api/portfolios/{portfolio_id}")
def get_portfolio(portfolio_id: str):
    result = supabase.table("portfolios").select("*").eq("id", portfolio_id).execute()
    if not result.data:
        raise HTTPException(404, "Portfolio not found")
    return result.data[0]

@app.put("/api/portfolios/{portfolio_id}")
def update_portfolio(portfolio_id: str, update: PortfolioUpdate, user_id: str = Depends(get_current_user)):
    check = supabase.table("portfolios").select("*").eq("id", portfolio_id).eq("user_id", user_id).execute()
    if not check.data:
        raise HTTPException(403, "Not yours")
    data = {k: v for k, v in update.dict().items() if v is not None}
    result = supabase.table("portfolios").update(data).eq("id", portfolio_id).execute()
    return result.data[0]

@app.get("/api/portfolios/by-slug/{slug}")
def get_portfolio_by_slug(slug: str):
    """Récupère un portfolio public par son slug."""
    result = supabase.table("portfolios").select("*").eq("slug", slug).execute()
    if not result.data:
        raise HTTPException(404, "Portfolio non trouvé")
    
    portfolio = result.data[0]
    # Optionnel: Vérifier si le portfolio est public ici ou dans le content_json
    return portfolio

@app.delete("/api/portfolios/{portfolio_id}")
def delete_portfolio(portfolio_id: str, user_id: str = Depends(get_current_user)):
    check = supabase.table("portfolios").select("*").eq("id", portfolio_id).eq("user_id", user_id).execute()
    if not check.data:
        raise HTTPException(403, "Not yours")
    supabase.table("portfolios").delete().eq("id", portfolio_id).execute()
    return {"message": "deleted"}