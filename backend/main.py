from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uuid
import google.generativeai as genai

load_dotenv()

from db import supabase
from schemas import PortfolioCreate, PortfolioUpdate, ChatRequest

# Initialize Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
app = FastAPI(title="Phi API")

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to your Firebase domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication Mock ---
def get_current_user(user_id: str = "test-user-id"):
    return user_id

# --- Ping ---
@app.get("/ping")
def ping():
    return {"status": "ok"}

# --- CREDITS API ---
@app.get("/api/credits/balance")
def get_credit_balance(user_id: str = Depends(get_current_user)):
    try:
        res = supabase.table("user_credits").select("balance").eq("user_id", user_id).execute()
        if not res.data:
            # Create user credits if none exist
            new_credits = {"user_id": user_id, "balance": 50}
            supabase.table("user_credits").insert(new_credits).execute()
            return {"balance": 50}
        return {"balance": res.data[0]["balance"]}
    except Exception as e:
        print(f"Db error: {e}")
        return {"balance": 50} # Return 50 gracefully if db falls through

# --- COACH IA API ---
@app.post("/api/coach/chat")
def coach_chat(request: ChatRequest):
    user_id = request.userId or "test-user-id"
    
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
            model = genai.GenerativeModel('gemini-2.5-flash')
            
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

@app.delete("/api/portfolios/{portfolio_id}")
def delete_portfolio(portfolio_id: str, user_id: str = Depends(get_current_user)):
    check = supabase.table("portfolios").select("*").eq("id", portfolio_id).eq("user_id", user_id).execute()
    if not check.data:
        raise HTTPException(403, "Not yours")
    supabase.table("portfolios").delete().eq("id", portfolio_id).execute()
    return {"message": "deleted"}