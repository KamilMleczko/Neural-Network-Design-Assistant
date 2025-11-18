from typing import Annotated
import logging
from sqlmodel import Session, SQLModel, create_engine, text
from sqlalchemy.exc import OperationalError
from fastapi import Depends
from .config_loader import settings
from ..models.user import User
from ..models.user_conversation import UserConversation
from ..models.message import Message

logger = logging.getLogger(__name__)


def create_database_engine():
  """Create database engine with automatic IPv6/IPv4 fallback"""
  # First, try the regular URI (supports only IPv6 networks)
  try:
    logger.info("Attempting connection with regular URI (IPv6 compatible)...")
    engine = create_engine(settings.SUPABASE_URI, echo=True, pool_timeout=5)

    # Test the connection
    with engine.connect() as conn:
      conn.execute(text("SELECT 1"))

    logger.info("✅ Connected successfully with regular URI")
    return engine

  except (OperationalError, Exception) as e:
    logger.warning(f"Regular URI connection failed: {e}")
    logger.info("Falling back to session pooler URI (IPv4 only)...")

    try:
      # Fallback to session pooler (IPv4 only)
      engine = create_engine(settings.SUPABASE_URI_SESSION_POOLER, echo=True)

      # Test the fallback connection
      with engine.connect() as conn:
        conn.execute(text("SELECT 1"))

      logger.info("✅ Connected successfully with session pooler URI (IPv4)")
      return engine

    except Exception as fallback_error:
      logger.error(f"Both connection methods failed. Session pooler error: {fallback_error}")
      raise fallback_error


engine = create_database_engine()


def create_db_and_tables():
  """Create all database tables"""
  SQLModel.metadata.create_all(engine)


def get_session():
  """Database session dependency"""
  with Session(engine) as session:
    yield session


SessionDep = Annotated[Session, Depends(get_session)]
