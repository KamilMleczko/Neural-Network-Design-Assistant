from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pinecone import IndexEmbed, Pinecone, ServerlessSpec
from .core.config_loader import settings
from .core.database import create_db_and_tables
from .routers import auth
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
  # Startup
  create_db_and_tables()
  print("✅ Database tables created:")
  yield

  # Shutdown
  print("👋 Shutting down...")


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
  return {"message": f"Welcome to {settings.APP_NAME}", "docs": "/docs", "health": "/health"}


def main():
  print("Hello from backend!")


if __name__ == "__main__":
  main()
