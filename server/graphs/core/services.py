import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
import sys

sys.path.append("../../..")
from services.pinecone_service import PineconeService

load_dotenv()

# Instantiate the LLM Client once
LLM_MODEL_NAME = os.getenv("LLM_MODEL_ID", "gpt-4o")
llm = init_chat_model(LLM_MODEL_NAME)

# Instantiate the Vector DB Client once
vector_db = PineconeService()
