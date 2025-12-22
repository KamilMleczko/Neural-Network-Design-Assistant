from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
    extra="ignore",
    env_ignore_empty=True,
  )
  PINECONE_API_KEY: str

  OPENAI_API_KEY: str
  HUGGINGFACEHUB_API_TOKEN: str
  LLM_MODEL_ID: str
  LLM_SIMPLE_MODEL_ID: str

  SUPABASE_PASSWORD: str
  SUPABASE_URL: str
  SUPABASE_API_KEY: str
  SUPABASE_URI: str
  SUPABASE_URI_SESSION_POOLER: str
  EXA_API_KEY: str

  # App
  APP_NAME: str = "nnda"
  ENVIRONMENT: str = "development"
  API_V1_PREFIX: str = "/api/v1"
