from pydantic import BaseModel
from typing import Optional, Dict

class PortfolioCreate(BaseModel):
    title: str
    template: str = "tech"
    content_json: Optional[Dict] = None

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    content_json: Optional[Dict] = None