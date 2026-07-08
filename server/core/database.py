from typing import Annotated
import logging
from sqlmodel import Session, SQLModel, create_engine, text
from sqlalchemy.exc import OperationalError
from fastapi import Depends
from .config_loader import settings

logger = logging.getLogger(__name__)


def create_database_engine():
  """Create database engine with automatic IPv6/IPv4 fallback and better connection handling"""
  # Connection pool settings for better reliability
  pool_settings = {
    "echo": True,
    "pool_pre_ping": True,  # Test connections before using them - prevents stale connection errors
    "pool_recycle": 3600,  # Recycle connections every hour
    "pool_size": 5,  # Number of connections to maintain
    "max_overflow": 10,  # Additional connections if pool is exhausted
    "connect_args": {
      "connect_timeout": 10,  # Timeout for initial connection
      "options": "-c statement_timeout=30000",  # 30 second query timeout
    },
  }

  # First, try the regular URI (supports only IPv6 networks)
  try:
    logger.info("Attempting connection with regular URI (IPv6 compatible)...")
    engine = create_engine(settings.SUPABASE_URI, **pool_settings)

    # Test the connection
    with engine.connect() as conn:
      conn.execute(text("SELECT 1"))

    logger.info("✅ Connected successfully with regular URI")
    return engine

  except (OperationalError, Exception) as e:
    logger.warning(f"Regular URI connection failed: {e}")
    logger.warning("Falling back to session pooler URI (IPv4 only)...")

    try:
      # Fallback to session pooler (IPv4 only)
      engine = create_engine(settings.SUPABASE_URI_SESSION_POOLER, **pool_settings)

      # Test the fallback connection
      with engine.connect() as conn:
        conn.execute(text("SELECT 1"))

      logger.info("✅ Connected successfully with session pooler URI (IPv4)")
      return engine

    except Exception as fallback_error:
      logger.error(f"Both connection methods failed. Session pooler error: {fallback_error}")
      raise fallback_error


engine = create_database_engine()



def get_session():
  """Database session dependency"""
  with Session(engine) as session:
    yield session


SessionDep = Annotated[Session, Depends(get_session)]
