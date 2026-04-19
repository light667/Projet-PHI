"""
Script pour lister les modèles Gemini gratuits disponibles avec votre clé API.
Usage: python check_gemini_models.py YOUR_API_KEY
"""
import sys
import json
import urllib.request

def check_models(api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            models = data.get("models", [])
            
            print(f"\n{'='*60}")
            print(f"  Modèles Gemini disponibles ({len(models)} trouvés)")
            print(f"{'='*60}\n")
            
            generate_models = []
            for m in models:
                name = m.get("name", "")
                display = m.get("displayName", "")
                methods = m.get("supportedGenerationMethods", [])
                
                if "generateContent" in methods:
                    generate_models.append(m)
                    print(f"  ✅ {display}")
                    print(f"     ID: {name}")
                    print(f"     Méthodes: {', '.join(methods)}")
                    tokens_in = m.get("inputTokenLimit", "?")
                    tokens_out = m.get("outputTokenLimit", "?")
                    print(f"     Tokens: {tokens_in} in / {tokens_out} out")
                    print()
            
            print(f"{'='*60}")
            print(f"  {len(generate_models)} modèles utilisables pour le chat")
            print(f"{'='*60}")
            
            # Recommend best free model
            for m in generate_models:
                name = m.get("name", "")
                if "gemini-2" in name and "flash" in name:
                    print(f"\n  🏆 Recommandé pour le Coach IA: {m.get('displayName')}")
                    print(f"     ID: {name}")
                    break
            
    except Exception as e:
        print(f"Erreur: {e}")
        if "403" in str(e):
            print("-> Clé API invalide ou API non activée")
        elif "401" in str(e):
            print("-> Clé API non autorisée")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python check_gemini_models.py VOTRE_CLE_API_GEMINI")
        sys.exit(1)
    check_models(sys.argv[1])
