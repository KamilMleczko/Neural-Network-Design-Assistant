import email
from fastapi import APIRouter, HTTPException, status
from ..schemas.user import UserCreate, UserRead
from ..core.database import SessionDep
from ..models.user import User
from ..core.supabase_client import supabase
from ..core.auth_dependencies import CurrentUser, SupabaseUser
from sqlmodel import select
from typing import Annotated
from fastapi import Depends


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/create-user", response_model=UserRead)
async def create_user(
  user_data: UserCreate,  # for now only username is needed (to be extended later)
  session: SessionDep,
  supabase_user: SupabaseUser,  # ← Gets id and email from token
):
  """
  Syncs Supabase user to our database.

  Frontend calls this after Supabase signup with email verification.
  Email and user ID come from verified JWT token.
  Only username is required from request body.
  """
  # Check if user already exists
  existing_user = session.exec(select(User).where(User.id == supabase_user.id)).first()

  # if user exists, something went wrong this is creation endpoint
  if existing_user:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

  # else create user in our database
  db_user = User(
    id=supabase_user.id,
    email=supabase_user.email,
    username=user_data.username,
  )

  session.add(db_user)
  session.commit()
  session.refresh(db_user)

  return db_user


@router.get("/me", response_model=UserRead)
async def get_me(current_user: CurrentUser):
  """Get current user info"""
  return current_user
