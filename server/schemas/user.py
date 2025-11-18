from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional


class UserCreate(SQLModel):
  username: str


class UserRead(SQLModel):
  user_id: str
  email: str
  username: str
  created_at: datetime


class UserDelete(SQLModel):
  user_id: str
