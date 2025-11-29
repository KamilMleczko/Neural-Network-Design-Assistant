from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime, timezone, UTC
from typing import Optional, TYPE_CHECKING, cast

if TYPE_CHECKING:
  from .user import User
  from .message import Message


class UserConversation(SQLModel, table=True):  # user_conversation
  # Primary key
  id: int | None = Field(default=None, primary_key=True)
  title: str = Field(index=True)
  description: str | None = None

  # Foreign keys
  user_id: str = Field(foreign_key="user.id", index=True)

  # Metadata
  created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), index=True)
  updated_at: datetime | None = Field(
    default_factory=lambda: datetime.now(UTC),
    sa_column_kwargs={"onupdate": lambda: datetime.now(UTC)},
  )

  # Relationships
  user: "User" = Relationship(back_populates="user_conversations")
  messages: list["Message"] = Relationship(
    back_populates="conversation", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
  )

  # Langgraph state
  state: dict = Field(default={}, sa_column=Column(JSONB))
