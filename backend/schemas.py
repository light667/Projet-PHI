from pydantic import BaseModel, Field
from typing import Optional, Dict, List

class PortfolioCreate(BaseModel):
    title: str
    template: str = "tech"
    content_json: Optional[Dict] = None

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    content_json: Optional[Dict] = None

class ChatMessage(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    userId: str # To bridge from frontend
    message: str
    history: List[ChatMessage] = []


class SocialLinks(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    behance: Optional[str] = None


class ProjectInput(BaseModel):
    name: str
    description: str = ""
    url: Optional[str] = None
    stack: Optional[str] = None


class PortfolioGenerateRequest(BaseModel):
    """Payload wizard + identifiants — aligné sur le CDC (identité, parcours, projets, style, objectif, domaine)."""
    userId: str
    title: str = Field(..., min_length=2, max_length=120)
    slug: str = Field(..., min_length=2, max_length=48, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    visibility: str = Field(default="public", pattern=r"^(public|private)$")
    domain: str = Field(..., min_length=2, max_length=32)

    full_name: str = Field(..., min_length=1, max_length=120)
    professional_title: str = Field(..., min_length=1, max_length=120)
    email: str = ""
    phone: str = ""
    location: str = ""
    social: SocialLinks = SocialLinks()

    bio: str = Field(..., min_length=20, max_length=8000)
    years_experience: Optional[int] = Field(default=None, ge=0, le=60)

    projects: List[ProjectInput] = Field(default_factory=list, max_length=12)

    tone: str = Field(default="professional", pattern=r"^(professional|creative|minimal)$")
    theme_variant: str = Field(default="light", pattern=r"^(light|dark)$")
    accent_color_hint: Optional[str] = Field(default=None, max_length=32)

    career_goal: str = Field(..., min_length=5, max_length=2000)
    target_audience: str = Field(default="", max_length=500)