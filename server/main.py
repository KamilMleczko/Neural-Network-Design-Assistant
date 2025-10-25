from os import getenv

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pinecone import IndexEmbed, Pinecone, ServerlessSpec

from .services.vector_store import PineconeService

load_dotenv()

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

pinecone_service = PineconeService()


@app.get("/")
def read_root() -> str:
  return "Hello, World!"


def main():
  print("Hello from backend!")


if __name__ == "__main__":
  main()
