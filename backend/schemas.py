from pydantic import BaseModel
from typing import Any, Dict, List, Literal, Optional

class PortfolioCreate(BaseModel):
    title: str
    template: str = "tech"
    content_json: Optional[Dict] = None

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    content_json: Optional[Dict] = None


class AIPortfolioGenerateRequest(BaseModel):
    identity: Dict[str, Any]
    experience: Dict[str, Any]
    projects: Dict[str, Any]
    skills: Dict[str, Any]
    style: Dict[str, Any]


class AIPortfolioSection(BaseModel):
    id: str
    type: Literal['hero', 'about', 'gallery', 'contact', 'projects', 'custom']
    isVisible: bool = True
    content: Dict[str, Any]


class AIPortfolioTheme(BaseModel):
    primaryColor: str
    secondaryColor: str
    fontFamily: str
    variant: Literal['light', 'dark']


class AIPortfolioLayout(BaseModel):
    navigation: Literal['sidebar', 'topbar', 'minimal']


class AIPortfolioGenerateResponse(BaseModel):
    title: str
    description: str
    domain: str
    tone: str
    style: str
    model: str
    seoKeywords: List[str]
    theme: AIPortfolioTheme
    layout: AIPortfolioLayout
    sections: List[AIPortfolioSection]