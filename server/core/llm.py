from langchain.chat_models import init_chat_model
from .config_loader import settings

# Instantiate the LLM Client once
LLM_MODEL_NAME = settings.LLM_SIMPLE_MODEL_ID
# llm for simple tasks - nto used for langchain graphs
llm_helper = init_chat_model(LLM_MODEL_NAME)
