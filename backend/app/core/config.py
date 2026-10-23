from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ---------------------------------------------------------
    # APPLICATION
    # ---------------------------------------------------------

    app_name: str = "Nirman Supplier Discovery API"
    frontend_url: str = "http://localhost:3000"

    # ---------------------------------------------------------
    # DATABASE
    # ---------------------------------------------------------

    database_url: str

    # ---------------------------------------------------------
    # AUTH0
    # ---------------------------------------------------------

    auth0_domain: str
    auth0_audience: str

    # ---------------------------------------------------------
    # NIRMAN INTERNAL PROXY
    # ---------------------------------------------------------

    # Shared only between Next.js server and FastAPI.
    # This must NOT be exposed to browser-side JavaScript.
    nirman_proxy_secret: str

    # ---------------------------------------------------------
    # ELASTICSEARCH
    # ---------------------------------------------------------

    elasticsearch_url: str = "http://localhost:9200"
    elasticsearch_index: str = "nirman_suppliers"

    # ---------------------------------------------------------
    # AWS / S3
    # ---------------------------------------------------------

    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    aws_region: str = "ap-south-1"
    aws_s3_bucket: str | None = None

    # ---------------------------------------------------------
    # OPENAI
    # ---------------------------------------------------------

    openai_api_key: str | None = None
    openai_model: str = "gpt-5.6"

    # ---------------------------------------------------------
    # LOCAL FILE UPLOAD FALLBACK
    # ---------------------------------------------------------

    local_upload_dir: str = "uploads"


settings = Settings()