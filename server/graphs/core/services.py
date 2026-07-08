from langchain.chat_models import init_chat_model
from exa_py import Exa
from server.services.pinecone_service import PineconeService
from server.core.config_loader import settings

POSTGRES_URI = settings.SUPABASE_URI
# Instantiate the LLM Client once
LLM_MODEL_NAME = settings.LLM_MODEL_ID
llm = init_chat_model(LLM_MODEL_NAME)

# Instantiate the Vector DB Client once
vector_db = PineconeService()
exa = Exa(api_key = settings.EXA_API_KEY)