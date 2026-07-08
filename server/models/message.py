from sqlmodel import Field, SQLModel, Relationship, Column, Text
from datetime import datetime, timezone, UTC
from uuid import UUID, uuid4
from enum import StrEnum
from .user_conversation import UserConversation
from typing import TYPE_CHECKING
if TYPE_CHECKING:
  from .user_conversation import UserConversation

class MessageRole(StrEnum):
  USER = "user"
  ASSISTANT = "assistant"
  SYSTEM = "system"


class Message(SQLModel, table=True):
  # Primary key
  id: UUID = Field(default_factory=uuid4, primary_key=True)

  # Foreign key
  conversation_id: UUID = Field(foreign_key="userconversation.id", index=True)

  role: MessageRole = Field(index=True)
  content: str
  created_at: datetime = Field(default_factory=lambda: datetime.now(tz=UTC), index=True)

  # Relationships
  conversation: "UserConversation" = Relationship(back_populates="messages")
