from sqlmodel import Field, SQLModel, Relationship, Column, Text
from datetime import datetime, timezone, UTC
from typing import Optional, TYPE_CHECKING
from enum import Enum

if TYPE_CHECKING:
  from .user_conversation import UserConversation


class MessageRole(str, Enum):
  USER = "user"
  ASSISTANT = "assistant"
  SYSTEM = "system"


class Message(SQLModel, table=True):
  # Primary key
  id: int | None = Field(default=None, primary_key=True)

  # Foreign key
  conversation_id: int = Field(foreign_key="userconversation.id", index=True)

  role: MessageRole = Field(index=True)
  content: str = Field(sa_column=Column(Text))
  created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), index=True)

  # Relationships
  conversation: "UserConversation" = Relationship(back_populates="messages")
