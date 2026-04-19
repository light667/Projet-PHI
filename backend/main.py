from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import json
import re
from typing import Any, Dict, List
import httpx

load_dotenv()

from db import supabase
from schemas import (
    AIPortfolioGenerateRequest,
    AIPortfolioGenerateResponse,
    AIPortfolioLayout,
    AIPortfolioSection,
    AIPortfolioTheme,
    PortfolioCreate,
    PortfolioUpdate,
)
import uuid


app = FastAPI(title="Phi API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper temporaire pour récupérer l'utilisateur (à remplacer par auth Supabase plus tard) ---
def get_current_user():
    # Pour l'instant, on fixe un user_id factice (tu pourras le remplacer par l'ID du user connecté)
    return "test-user-id"


def split_list(value: Any) -> List[str]:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]

    if not isinstance(value, str):
        return []

    return [part.strip() for part in re.split(r"[\n,;]+", value) if part.strip()]


def build_fallback_ai_response(payload: Dict[str, Any]) -> AIPortfolioGenerateResponse:
    identity = payload.get("identity", {})
    experience = payload.get("experience", {})
    projects = payload.get("projects", {})
    skills = payload.get("skills", {})
    style = payload.get("style", {})

    full_name = str(identity.get("fullName", "Portfolio")).strip() or "Portfolio"
    current_role = str(identity.get("currentRole", "")).strip()
    target_role = str(identity.get("targetRole", "")).strip()
    title = f"{full_name} — {current_role or target_role or 'Portfolio'}"

    description = (
        str(identity.get("summary", "")).strip()
        or str(experience.get("summary", "")).strip()
        or "Portfolio généré automatiquement à partir du questionnaire IA."
    )

    domain = str(identity.get("domain", "Général")).strip() or "Général"
    tone = str(style.get("tone", "professionnel")).strip() or "professionnel"
    visual_style = str(style.get("visualStyle", "minimaliste")).strip() or "minimaliste"
    layout_value = str(style.get("layout", "topbar")).strip() or "topbar"
    font_family = str(style.get("fontFamily", "Inter")).strip() or "Inter"
    skill_list = split_list(skills.get("skills", []))
    tool_list = split_list(skills.get("tools", []))
    seo_keywords = split_list(skills.get("seoFocus", []))
    project_list = split_list(projects.get("highlights", []))
    project_impact = str(projects.get("impact", "")).strip()

    sections = [
        AIPortfolioSection(
            id="hero",
            type="hero",
            isVisible=True,
            content={
                "label": "Accueil",
                "headline": title,
                "summary": description,
                "cta": "Découvrir le portfolio",
                "tags": skill_list[:4],
            },
        ),
        AIPortfolioSection(
            id="about",
            type="about",
            isVisible=True,
            content={
                "label": "À propos",
                "headline": "Parcours et positionnement",
                "summary": str(experience.get("summary", "")).strip(),
                "education": str(experience.get("education", "")).strip(),
            },
        ),
        AIPortfolioSection(
            id="projects",
            type="projects",
            isVisible=True,
            content={
                "label": "Projets",
                "headline": "Réalisations clés",
                "items": [
                    {
                        "title": item,
                        "description": project_impact or f"Impact attendu pour {item}",
                    }
                    for item in project_list
                ],
            },
        ),
        AIPortfolioSection(
            id="skills",
            type="custom",
            isVisible=True,
            content={
                "label": "Compétences",
                "headline": "Stack et outils",
                "skills": skill_list,
                "tools": tool_list,
            },
        ),
        AIPortfolioSection(
            id="contact",
            type="contact",
            isVisible=True,
            content={
                "label": "Contact",
                "headline": "Échanger sur un projet",
                "summary": f"Pensé pour {identity.get('audience', 'votre audience')}",
                "keywords": seo_keywords,
            },
        ),
    ]

    return AIPortfolioGenerateResponse(
        title=title,
        description=description,
        domain=domain,
        tone=tone,
        style=visual_style,
        model="local-fallback",
        seoKeywords=seo_keywords,
        theme=AIPortfolioTheme(
            primaryColor="#1d4ed8" if tone != "audacieux" else "#0f172a",
            secondaryColor="#f8fafc" if visual_style != "premium" else "#f7f3ed",
            fontFamily=font_family,
            variant="light",
        ),
        layout=AIPortfolioLayout(navigation=layout_value if layout_value in {"sidebar", "topbar", "minimal"} else "topbar"),
        sections=sections,
    )


async def generate_ai_response(payload: Dict[str, Any]) -> AIPortfolioGenerateResponse:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return build_fallback_ai_response(payload)

    system_prompt = (
        "Tu crées des portfolios de manière éditoriale et tu réponds uniquement en JSON strict. "
        "Le JSON doit contenir: title, description, domain, tone, style, model, seoKeywords, theme, layout, sections. "
        "Chaque section doit avoir id, type, isVisible et content. Réponds en français."
    )

    user_prompt = json.dumps(payload, ensure_ascii=False, indent=2)

    request_body = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 2200,
        "temperature": 0.7,
        "system": system_prompt,
        "messages": [
            {
                "role": "user",
                "content": user_prompt,
            }
        ],
    }

    async with httpx.AsyncClient(timeout=90) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json=request_body,
        )

    if response.status_code >= 400:
        return build_fallback_ai_response(payload)

    raw_content = response.json().get("content", [])
    message_text = ""
    for part in raw_content:
        if part.get("type") == "text":
            message_text += part.get("text", "")

    if not message_text.strip():
        return build_fallback_ai_response(payload)

    try:
        parsed = json.loads(message_text)
    except json.JSONDecodeError:
        start = message_text.find("{")
        end = message_text.rfind("}")
        if start == -1 or end == -1 or end <= start:
            return build_fallback_ai_response(payload)
        parsed = json.loads(message_text[start : end + 1])

    return AIPortfolioGenerateResponse.model_validate(parsed)


@app.post("/api/ai/portfolio/generate", response_model=AIPortfolioGenerateResponse)
async def generate_ai_portfolio(payload: AIPortfolioGenerateRequest):
    return await generate_ai_response(payload.model_dump())

# --- Ping ---
@app.get("/ping")
def ping():
    return {"status": "ok", "env": os.getenv("SUPABASE_URL", "not set")}

# --- CRUD Portfolios ---
@app.post("/api/portfolios")
def create_portfolio(portfolio: PortfolioCreate, user_id: str = Depends(get_current_user)):
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
    # Vérifier que le portfolio appartient bien à l'utilisateur
    check = supabase.table("portfolios").select("*").eq("id", portfolio_id).eq("user_id", user_id).execute()
    if not check.data:
        raise HTTPException(403, "Not yours")
    data = {k: v for k, v in update.dict().items() if v is not None}
    result = supabase.table("portfolios").update(data).eq("id", portfolio_id).execute()
    return result.data[0]

@app.delete("/api/portfolios/{portfolio_id}")
def delete_portfolio(portfolio_id: str, user_id: str = Depends(get_current_user)):
    check = supabase.table("portfolios").select("*").eq("id", portfolio_id).eq("user_id", user_id).execute()
    if not check.data:
        raise HTTPException(403, "Not yours")
    supabase.table("portfolios").delete().eq("id", portfolio_id).execute()
    return {"message": "deleted"}