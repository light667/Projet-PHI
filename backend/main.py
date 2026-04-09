from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Phi API")

@app.get("/ping")
def ping():
    return {"status": "ok", "env": os.getenv("SUPABASE_URL", "not set")}