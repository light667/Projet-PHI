from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
import os
import uuid
from db import supabase
from schemas import PortfolioCreate, PortfolioUpdate

load_dotenv()

app = FastAPI(title="Phi API")

# --- Helper temporaire pour récupérer l'utilisateur (à remplacer par auth Supabase plus tard) ---
def get_current_user():
    # Pour l'instant, on fixe un user_id factice (tu pourras le remplacer par l'ID du user connecté)
    return "test-user-id"

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