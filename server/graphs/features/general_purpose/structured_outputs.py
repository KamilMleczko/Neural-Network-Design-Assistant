from pydantic import BaseModel, Field
from typing import Literal


class MessageType(BaseModel):
  message_type: Literal["ml_problem_description", "question_about_article", "other"] = Field(
    ...,
    description="""
    Topic of the user's message.
    - 'ml_problem_description': The user is describing a machine learning problem he has (e.g., "I want to build a model that..." or "What could I use for classification of ...").
    - 'question_about_article': The user is asking a question about a specific article (e.g., "Can you explain the method used in article X?").
    - 'other': The user's message does not fit into the above categories.
    """,
  )
