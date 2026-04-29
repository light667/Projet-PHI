from pydantic import BaseModel, Field
from typing import Optional, Dict, List

class PortfolioCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=120)
    template: str = Field(default="tech", max_length=64)
    slug: Optional[str] = Field(default=None, min_length=2, max_length=48, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    visibility: str = Field(default="private", pattern=r"^(public|private)$")
    status: str = Field(default="draft", pattern=r"^(draft|published|archived)$")
    content_json: Optional[Dict] = None

class PortfolioUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=120)
    slug: Optional[str] = Field(default=None, min_length=2, max_length=48, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    visibility: Optional[str] = Field(default=None, pattern=r"^(public|private)$")
    status: Optional[str] = Field(default=None, pattern=r"^(draft|published|archived)$")
    content_json: Optional[Dict] = None

class ChatMessage(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    userId: str = "" # Backward compatibility; backend trusts the Firebase token.
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
    profile_image_url: Optional[str] = None
    email: str = ""
    phone: str = ""
    whatsapp: Optional[str] = None
    location: str = ""
    social: SocialLinks = SocialLinks()

    bio: str = Field(..., min_length=20, max_length=8000)
    skills: List[str] = Field(default_factory=list)
    experiences: List[str] = Field(default_factory=list)
    years_experience: Optional[int] = Field(default=None, ge=0, le=60)

    projects: List[ProjectInput] = Field(default_factory=list, max_length=12)
    services: List[str] = Field(default_factory=list)
    ai_propose_services: bool = False

    tone: str = Field(default="professional", pattern=r"^(professional|creative|minimal)$")
    theme_variant: str = Field(default="light", pattern=r"^(light|dark)$")
    accent_color_hint: Optional[str] = Field(default=None, max_length=32)

    career_goal: str = Field(..., min_length=5, max_length=2000)
    target_audience: str = Field(default="", max_length=500)
