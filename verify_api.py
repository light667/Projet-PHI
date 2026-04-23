from openai import OpenAI

# Utilise l'un ou l'autre selon ta clé
client = OpenAI(
    api_key="sk-1idI0ahCg3oiJhdA7Dk9XyufwaF2ayklyaPK5npSiHbHgjkB",
    base_url="https://api.kimi.ai/v1" # ou "https://api.moonshot.cn/v1"
)

try:
    models = client.models.list()
    print("--- Modèles accessibles ---")
    for model in models.data:
        print(f"- {model.id}")
except Exception as e:
    print(f"Erreur d'authentification : {e}")