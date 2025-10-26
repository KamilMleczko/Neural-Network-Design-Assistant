import sys
from pathlib import Path

server_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(server_root))
from services.pinecone_service import PineconeService
import pandas as pd


def main():
  df = pd.read_parquet(
    "/home/kamil/repos/nnda/server/notebooks/neural_net_papers_metadata.parquet.gzip"
  )
  df_part = df[0:5]
  print(f"DataFrame part to upsert:\n{df_part}")

  pinecone_service = PineconeService()

  # pinecone_service.upsert_dataframe_to_pinecone(
  #     df=df_part,
  #     index_name="nndm-dense",
  #     col_to_embed="abstract",
  #     cols_as_metadata=["arxiv_id", "title", "year", "article_url", "repo_url_list", "authors_list"],
  #     namespace="__base_knowledge__",
  #     batch_size=5,
  # )

  # pinecone_service.upsert_dataframe_to_pinecone(
  #       df=df_part,
  #       index_name="nndm-sparse",
  #       col_to_embed="abstract",
  #       cols_as_metadata=["arxiv_id", "title", "year", "article_url", "repo_url_list", "authors_list"],
  #       namespace="__base_knowledge__",
  #       batch_size=5,
  #   )


if __name__ == "__main__":
  main()
