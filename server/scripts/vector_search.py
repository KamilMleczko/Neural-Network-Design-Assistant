from ..services.pinecone_service import PineconeService


def main():
  pinecone_service = PineconeService()
  results = pinecone_service.hybrid_search(
    "Many Applications", namespace="__abstracts__", candidates=10, limit=3
  )
  print(f"results: {results}")


if __name__ == "__main__":
  main()
