from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config_loader import settings
from .routers import auth, chat


app = FastAPI(title=settings.APP_NAME)
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(chat.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
  return {"message": f"Welcome to {settings.APP_NAME}", "docs": "/docs", "health": "/health"}


def main():
  print("Hello from backend!")


if __name__ == "__main__":
  main()
