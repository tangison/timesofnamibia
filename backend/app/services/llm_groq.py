import json

import httpx

from app.core.config import settings


class GroqClient:
    def __init__(self):
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    def available(self) -> bool:
        return bool(self.api_key)

    def chat_json(self, system: str, user: str) -> dict:
        if not self.available():
            raise RuntimeError("GROQ_API_KEY missing")

        payload = {
            "model": self.model,
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        with httpx.Client(timeout=30) as client:
            resp = client.post(self.url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
        content = data["choices"][0]["message"]["content"]
        return json.loads(content)
