import sys
from pathlib import Path

server_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(server_root))
from services.pinecone_service import PineconeService
import pandas as pd


def main():
  df = pd.read_parquet(
    "/home/kamil/repos/nnda/server/notebooks/arxiv_most_cited_tier_I.parquet.gzip"
  )
  print(f"Amount of records to upsert: {len(df)}")

  pinecone_service = PineconeService()

  pinecone_service.upsert_chunked_pdfs(df=df, namespace="__chunks__", batch_size=5)


if __name__ == "__main__":
  main()
