from pydantic import BaseModel, Field
from typing import Literal


class MessageType(BaseModel):
  message_type: Literal["relevant_article_suggestions", "article_contents_analysis", "repository_summaries", "other"] = Field(
    ...,
    description="""
    Intended functionality to choose based on the user's message.
    """,
  )

  