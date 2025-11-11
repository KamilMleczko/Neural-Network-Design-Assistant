import sys
from pathlib import Path

server_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(server_root))
from services.pinecone_service import PineconeService


def main():
  pinecone_service = PineconeService()
  results = pinecone_service.hybrid_search(
    "Many Applications", namespace="__abstracts__", candidates=10, limit=3
  )
  print(f"results: {results}")


if __name__ == "__main__":
  main()
