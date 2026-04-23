import requests
import json

url = "http://localhost:8000/api/portfolios/generate"

payload = {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Mon Portfolio Tech",
    "slug": "mon-portfolio-tech",
    "visibility": "public",
    "domain": "dev",
    "full_name": "Jean Dupont",
    "professional_title": "Développeur Fullstack",
    "email": "jean.dupont@example.com",
    "phone": "+33 6 12 34 56 78",
    "location": "Paris, France",
    "bio": "Je suis un développeur passionné par le web et les nouvelles technologies. J'ai 5 ans d'expérience en React et Python.",
    "skills": ["React", "Python", "FastAPI", "TypeScript"],
    "experiences": ["Lead Dev chez Google (2020-2023)", "Développeur Senior chez Amazon (2018-2020)"],
    "years_experience": 5,
    "projects": [
        {
            "name": "Projet Alpha",
            "description": "Une application de gestion de tâches révolutionnaire.",
            "url": "https://alpha.com",
            "stack": "React, Firebase"
        }
    ],
    "services": ["Développement Web", "Conseil Tech"],
    "ai_propose_services": True,
    "tone": "professional",
    "theme_variant": "light",
    "career_goal": "Trouver un poste de CTO dans une startup innovante.",
    "target_audience": "Recruteurs et entrepreneurs"
}

print("Envoi de la requête de génération...")
try:
    response = requests.post(url, json=payload, timeout=150)
    print(f"Statut: {response.status_code}")
    if response.status_code == 200:
        print("Succès !")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print(f"Erreur: {response.text}")
except Exception as e:
    print(f"Exception: {e}")
