from logging.config import fileConfig

from sqlalchemy import create_engine
from sqlalchemy import pool
from sqlalchemy.exc import OperationalError 
from sqlalchemy import pool

from alembic import context

from sqlmodel import SQLModel
from models import *
from core.config_loader import settings


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config
config.set_main_option("sqlalchemy.url", settings.SUPABASE_URI)
# supabase does not handle IPV4 connections via direct connection string - great design :)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = SQLModel.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = get_connectable()

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

def get_connectable():
    """Try the direct connection first, fall back to the IPv4 session pooler."""
    cfg_section = config.get_section(config.config_ini_section, {})

    try:
        engine = create_engine(cfg_section["sqlalchemy.url"], poolclass=pool.NullPool)
        # force a real connection attempt now, rather than lazily on first use
        with engine.connect():
            pass
        return engine
    except OperationalError:
        print("Direct connection failed (likely no IPv6) — falling back to session pooler URI")
        return create_engine(settings.SUPABASE_URI_SESSION_POOLER, poolclass=pool.NullPool)



if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
