# ai_service/test_api.py (avec Gemini en backup)

import os
import json
import time
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
import google.generativeai as genai

load_dotenv()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

LOGS_DIR = Path("logs")
LOGS_DIR.mkdir(exist_ok=True)
LOG_FILE = LOGS_DIR / "calls.jsonl"
def log_call(provider: str, prompt: str, response: str, duration_ms: int, error: str = None):
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "provider": provider,
        "prompt_preview": prompt[:200],
        "response_preview": response[:200] if response else None,
        "duration_ms": duration_ms,
        "error": error,
    }
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
def call_llm(prompt: str, prefer_groq: bool = True) -> str:
    """Appelle Groq d'abord, puis Gemini si échec"""
    
    start = time.time()
    
    if prefer_groq:
        try:
            response = groq_client.chat.completions.create(
<<<<<<< HEAD
                model="llama-3.3-70b-versatile" ,
=======
                model="llama3-8b-8192",
>>>>>>> origin/ai-service
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=500,
            )
            result = response.choices[0].message.content
            duration_ms = int((time.time() - start) * 1000)
            log_call("groq", prompt, result, duration_ms)
            return result
        except Exception as e:
            print(f"⚠️ Groq échoué : {e}, fallback sur Gemini")
    
    # Fallback sur Gemini
    try:
        response = gemini_model.generate_content(prompt)
        result = response.text
        duration_ms = int((time.time() - start) * 1000)
        log_call("gemini", prompt, result, duration_ms)
        return result
    except Exception as e:
        duration_ms = int((time.time() - start) * 1000)
        log_call("gemini", prompt, "", duration_ms, error=str(e))
        return f"Erreur : {e}"
def generer_bio(nom: str, titre: str, secteur: str, experience: str) -> str:
    prompt = f"""
Tu es un rédacteur professionnel de portfolios.

Génère une bio professionnelle à partir des infos suivantes :
- Nom : {nom}
- Titre : {titre}
- Secteur : {secteur}
- Expérience clé : {experience}

La bio doit :
- Faire 3 à 4 phrases
- Être percutante et professionnelle
- Inclure un appel à l'action
- Être rédigée à la première personne
"""
    return call_llm(prompt)

<<<<<<< HEAD
def generer_portfolio_complet(profil: dict) -> dict:
    """Génère tout le contenu du portfolio en une fois, format JSON"""
    
    prompt = f"""
Tu es un générateur de contenu pour portfolio.

À partir de ces informations :
- Nom : {profil.get('nom')}
- Titre : {profil.get('titre')}
- Secteur : {profil.get('secteur')}
- Expérience : {profil.get('experience')}
- Projet : {profil.get('nom_projet', '')}
- Technologies : {profil.get('technologies', '')}

Génère UNIQUEMENT un objet JSON valide avec cette structure EXACTE :
{{
    "bio": "bio professionnelle 3-4 phrases à la 1ère personne",
    "description_projet": "description du projet 4-5 phrases (problème → solution → résultat)",
    "meta_seo": {{
        "title": "titre SEO 50-60 caractères",
        "description": "meta description 150-160 caractères",
        "keywords": "mots, clés, pertinents"
    }}
}}
Ne mets RIEN d'autre que le JSON.
"""
    resultat = call_llm(prompt)  # ou client.generate(prompt)
    # Essayer de parser le JSON
    try:
        import json
        return json.loads(resultat)
    except:
        return {"erreur": "Le modèle n'a pas retourné du JSON valide", "raw": resultat}
    
def generer_portfolio_complet(profil: dict) -> dict:
    """Génère tout le contenu du portfolio en une fois, format JSON"""
    
    prompt = f"""
Tu es un générateur de contenu pour portfolio.

À partir de ces informations :
- Nom : {profil.get('nom')}
- Titre : {profil.get('titre')}
- Secteur : {profil.get('secteur')}
- Expérience : {profil.get('experience')}
- Projet : {profil.get('nom_projet', '')}
- Technologies : {profil.get('technologies', '')}

Génère UNIQUEMENT un objet JSON valide avec cette structure EXACTE :
{{
    "bio": "bio professionnelle 3-4 phrases à la 1ère personne",
    "description_projet": "description du projet 4-5 phrases (problème → solution → résultat)",
    "meta_seo": {{
        "title": "titre SEO 50-60 caractères",
        "description": "meta description 150-160 caractères",
        "keywords": "mots, clés, pertinents"
    }}
}}
Ne mets RIEN d'autre que le JSON.
"""
    resultat = call_llm(prompt)
    try:
        import json
        return json.loads(resultat)
    except:
        return {"erreur": "Le modèle n'a pas retourné du JSON valide", "raw": resultat}

=======
>>>>>>> origin/ai-service
# TEsTS
if __name__ == "__main__":
    print("🧪 TEST avec fallback Groq → Gemini\n")
    
    bio = generer_bio(
        nom="OURO-AGOUDA Irfaan",
        titre="Développeur GenAI",
        secteur="Tech / IA",
        experience="3 ans en startup, spécialisé React et Python"
    )
    
    print(f"📝 Bio générée :\n{bio}\n")
    print("✅ Logs dans logs/calls.jsonl")