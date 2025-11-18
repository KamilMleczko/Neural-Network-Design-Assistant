from typing import Annotated
from fastapi import Depends, HTTPException, Header, status
from .supabase_client import supabase
from .database import SessionDep
from ..models.user import User
from sqlmodel import select
from pydantic import BaseModel


class SupabaseUserInfo(BaseModel):
  """Complete Supabase user information from JWT token"""

  id: str
  email: str | None = None


async def get_supabase_user_info(
  authorization: Annotated[str | None, Header()] = None,
) -> SupabaseUserInfo:
  """
  Extract and verify JWT token, return Supabase user info (Auth module).

  This is the base dependency that talks to Supabase.
  """
  if not authorization or not authorization.startswith("Bearer "):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

  token = authorization.replace("Bearer ", "")

  try:
    user_response = supabase.auth.get_user(token)

    if not user_response or not user_response.user:
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials"
      )

    return SupabaseUserInfo(
      id=user_response.user.id,
      email=user_response.user.email,
      # Add more fields as needed:
      # phone=user_response.user.phone,
      # email_confirmed_at=user_response.user.email_confirmed_at,
    )

  except Exception as e:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")


async def get_current_user(
  session: SessionDep, supabase_info: Annotated[SupabaseUserInfo, Depends(get_supabase_user_info)]
) -> User:
  """
  Get current user from database.

  Uses supabase_info to look up user by supabase_user_id.
  """
  user = session.exec(select(User).where(User.id == supabase_info.id)).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found in database")

  return user


# SupabaseUserInfo (shouldnt be used outside of sync endpoint)
SupabaseUser = Annotated[SupabaseUserInfo, Depends(get_supabase_user_info)]

# Internal Database User
# all fields existing in auth module that have use on backend
# stored in separate database from auth module
CurrentUser = Annotated[User, Depends(get_current_user)]
