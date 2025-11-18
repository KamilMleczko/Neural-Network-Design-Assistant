from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional


class UserConversationCreate(SQLModel):
  user_id: str
  title: str


class UserConversationUpdate(SQLModel):
  title: str | None = None


class UserConversationRead(SQLModel):
  id: int
  user_id: str
  title: str
  created_at: datetime


class UserConversationDelete(SQLModel):
  id: int
