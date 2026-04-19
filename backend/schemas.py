from pydantic import BaseModel
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