import sys
from pathlib import Path

server_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(server_root))
from services.pinecone_service import PineconeService
import pandas as pd


def main():
  df = pd.read_parquet("/home/kamil/repos/nnda/server/notebooks/dataset_v1.parquet.gzip")
  df_part = df.iloc[0:1]
  print(f"DataFrame part to upsert:\n{df_part}")

  pinecone_service = PineconeService()

  pinecone_service.upsert_chunked_pdfs(df=df_part, namespace="__chunks__", batch_size=96)


if __name__ == "__main__":
  main()
