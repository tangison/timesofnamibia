from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "NamibiaTimes Backend"
    environment: str = "dev"
    api_v1_prefix: str = "/api/v1"
    backend_cors_origins: str = "http://localhost:3000"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/namibiatimes"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    internal_api_secret: str = ""

    @field_validator("internal_api_secret")
    @classmethod
    def _secret_must_be_set_and_not_weak(cls, v: str) -> str:
        if not v:
            raise ValueError(
                "INTERNAL_API_SECRET env var is required. "
                "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
            )
        if v in {"change-me", "changeme", "secret", "password", "test"}:
            raise ValueError(
                "INTERNAL_API_SECRET must not be a weak placeholder. "
                "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
            )
        if len(v) < 16:
            raise ValueError("INTERNAL_API_SECRET must be at least 16 characters")
        return v

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.backend_cors_origins.split(",") if o.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


class _SettingsProxy:
    def __getattr__(self, name: str):
        return getattr(get_settings(), name)

    def __setattr__(self, name: str, value):
        setattr(get_settings(), name, value)


settings = _SettingsProxy()
