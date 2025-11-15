from ..services.pinecone_service import PineconeService
import pandas as pd


def main():
  df = pd.read_parquet(
    "/home/kamil/repos/nnda/server/notebooks/arxiv_most_cited_tier_I.parquet.gzip"
  )
  print(f"Amount of records to upsert: {len(df)}")

  pinecone_service = PineconeService()

  pinecone_service.upsert_dataframe_to_pinecone(
    df=df,
    index_name="nndm-dense",
    col_to_embed="abstract",
    cols_as_metadata=[
      "arxiv_id",
      "title",
      "year",
      "article_url",
      "repo_url_list",
      "authors_list",
      "citations",
    ],
    namespace="__abstracts__",
    batch_size=5,
  )

  pinecone_service.upsert_dataframe_to_pinecone(
    df=df,
    index_name="nndm-sparse",
    col_to_embed="abstract",
    cols_as_metadata=[
      "arxiv_id",
      "title",
      "year",
      "article_url",
      "repo_url_list",
      "authors_list",
      "citations",
    ],
    namespace="__abstracts__",
    batch_size=5,
  )


if __name__ == "__main__":
  main()
