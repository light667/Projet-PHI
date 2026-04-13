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

                model="llama-3.3-70b-versatile" ,

                
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
    
# ============================================================
# CONFIGURATION MULTILINGUE
# ============================================================

LANGUE_CONFIG = {
    "fr": {
        "instruction_systeme": "Tu es un générateur de contenu professionnel pour portfolio. Tu réponds UNIQUEMENT en français.",
        "instruction_json": "Génère UNIQUEMENT un objet JSON valide. Ne mets RIEN d'autre que le JSON. Pas de ```json, pas d'explication.",
        "champs": {
            "bio": "bio professionnelle de 3-4 phrases à la 1ère personne",
            "description_projet": "description du projet en 4-5 phrases (problème → solution → résultat)",
            "meta_seo_title": "titre SEO de 50-60 caractères",
            "meta_seo_description": "meta description de 150-160 caractères",
            "meta_seo_keywords": "mots-clés séparés par des virgules",
        },
    },
    "en": {
        "instruction_systeme": "You are a professional portfolio content generator. You respond ONLY in English.",
        "instruction_json": "Generate ONLY a valid JSON object. Do NOT include anything else. No ```json, no explanation.",
        "champs": {
            "bio": "professional bio of 3-4 sentences in first person",
            "description_projet": "project description in 4-5 sentences (problem → solution → result)",
            "meta_seo_title": "SEO title of 50-60 characters",
            "meta_seo_description": "meta description of 150-160 characters",
            "meta_seo_keywords": "comma-separated relevant keywords",
        },
    },
    
}

# Langues supportées — utilisé pour la validation
LANGUES_SUPPORTEES = list(LANGUE_CONFIG.keys())


# ============================================================
# FONCTION PRINCIPALE MULTILINGUE
# ============================================================

def generer_portfolio_complet(profil: dict, langue: str = "fr") -> dict:
    """
    Génère le contenu complet d'un portfolio dans la langue demandée.

    Args:
        profil  : dict avec les clés nom, titre, secteur, experience,
                  nom_projet (optionnel), technologies (optionnel)
        langue  : "fr" (défaut), "en", "ewe"

    Returns:
        dict avec les clés : bio, description_projet, meta_seo
        En cas d'erreur : {"erreur": "...", "raw": "...", "langue": "..."}
    """

    # Validation de la langue
    if langue not in LANGUES_SUPPORTEES:
        langue = "fr"
        print(f"[WARN] Langue non supportée. Fallback sur 'fr'. Langues disponibles : {LANGUES_SUPPORTEES}")

    config = LANGUE_CONFIG[langue]
    champs = config["champs"]

    # Construction du prompt
    prompt = f"""{config["instruction_systeme"]}

{config["instruction_json"]}

Informations du profil :
- Nom : {profil.get('nom', 'Non renseigné')}
- Titre : {profil.get('titre', 'Non renseigné')}
- Secteur : {profil.get('secteur', 'Non renseigné')}
- Expérience : {profil.get('experience', 'Non renseigné')}
- Projet principal : {profil.get('nom_projet', 'Non renseigné')}
- Technologies utilisées : {profil.get('technologies', 'Non renseigné')}

Structure JSON EXACTE à retourner (les clés ne changent JAMAIS) :
{{
    "bio": "{champs['bio']}",
    "description_projet": "{champs['description_projet']}",
    "meta_seo": {{
        "title": "{champs['meta_seo_title']}",
        "description": "{champs['meta_seo_description']}",
        "keywords": "{champs['meta_seo_keywords']}"
    }}
}}"""

    # Appel LLM (inchangé — respecte ta contrainte)
    resultat_brut = call_llm(prompt)

    # Nettoyage défensif : certains LLMs ajoutent ```json ... ``` malgré l'instruction
    resultat_nettoye = resultat_brut.strip()
    if resultat_nettoye.startswith("```"):
        lignes = resultat_nettoye.split("\n")
        # Retire la première ligne (```json ou ```) et la dernière (```)
        resultat_nettoye = "\n".join(lignes[1:-1]).strip()

    # Parsing JSON
    try:
        contenu = json.loads(resultat_nettoye)

        # Vérification que les clés obligatoires sont présentes
        cles_requises = {"bio", "description_projet", "meta_seo"}
        cles_manquantes = cles_requises - set(contenu.keys())
        if cles_manquantes:
            return {
                "erreur": f"JSON incomplet — clés manquantes : {cles_manquantes}",
                "raw": resultat_brut,
                "langue": langue,
            }

        # Injection de la langue dans le résultat (utile pour le backend)
        contenu["langue"] = langue
        return contenu

    except json.JSONDecodeError as e:
        return {
            "erreur": f"JSON invalide : {str(e)}",
            "raw": resultat_brut,
            "langue": langue,
        }



# BLOC DE TEST — à lancer avec : python test_api.py


if __name__ == "__main__":

    profil_test = {
        "nom": "Irfaan OURO-AGOUDA",
        "titre": "Étudiant en Intelligence Artificielle",
        "secteur": "Technologie / IA",
        "experience": "3 ans de projets académiques en machine learning , en Gen AI et en  développement Python",
        "nom_projet": "PHI — Portfolio & Career Intelligence Platform",
        "technologies": "Python,React, FastAPI, Groq API, Gemini, Supabase, React",
    }

    for lang in ["fr", "en", "ewe"]:
        print(f"\n{'='*60}")
        print(f"  TEST LANGUE : {lang.upper()}")
        print(f"{'='*60}")

        resultat = generer_portfolio_complet(profil_test, langue=lang)

        if "erreur" in resultat:
            print(f"[ERREUR] {resultat['erreur']}")
            print(f"[RAW]    {resultat.get('raw', '')[:200]}")
        else:
            print(f"BIO ({lang}):\n  {resultat['bio']}\n")
            print(f"PROJET ({lang}):\n  {resultat['description_projet']}\n")
            print(f"SEO TITLE:  {resultat['meta_seo']['title']}")
            print(f"SEO DESC:   {resultat['meta_seo']['description']}")
            print(f"KEYWORDS:   {resultat['meta_seo']['keywords']}")

        # Pause entre les appels pour respecter le rate limit Groq
        import time
        time.sleep(2)

