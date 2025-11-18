from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional
from models.message import MessageRole


class MessageCreate(SQLModel):
  conversation_id: int
  role: MessageRole
  content: str


class MessageUpdate(SQLModel):
  content: str | None = None


class MessageRead(SQLModel):
  id: int
  conversation_id: int
  role: MessageRole
  content: str
  created_at: datetime


class MessageDelete(SQLModel):
  id: int
