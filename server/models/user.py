from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime, timezone, UTC
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
  from .user_conversation import UserConversation


class User(SQLModel, table=True):
  # Primary key (autogeneration turned off)
  id: str = Field(primary_key=True, index=True)  # Supabase Auth UUID
  username: str = Field(index=True)
  email: str | None = Field(unique=True, index=True)
  created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), index=True)

  # Relationships
  user_conversations: list["UserConversation"] = Relationship(back_populates="user")
