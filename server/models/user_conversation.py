from sqlmodel import Column, Field, SQLModel, Relationship
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime, UTC
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

if TYPE_CHECKING: # recommended way for dealing with circular imports in sql model
  from .user import User 
  from .message import Message


class UserConversation(SQLModel, table=True):  # user_conversation
  # Primary key
  id: UUID = Field(default_factory=uuid4, primary_key=True)
  title: str | None = None
  description: str | None = None

  # Foreign keys
  user_id: UUID = Field(foreign_key="user.id",  ondelete="CASCADE", index=True)

  # Metadata
  created_at: datetime = Field(default_factory=lambda: datetime.now(tz=UTC), index=True)
  updated_at: datetime | None = Field(
    default_factory=lambda: datetime.now(tz=UTC),
    sa_column_kwargs={"onupdate": lambda: datetime.now(tz=UTC)},
  )

  # Relationships
  user: "User" = Relationship(back_populates="user_conversations")
  messages: list["Message"] = Relationship(
    back_populates="conversation", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
  )

  # Langgraph state
  state: dict = Field(default_factory=dict, sa_column=Column(JSONB))  # Use JSON type for state
