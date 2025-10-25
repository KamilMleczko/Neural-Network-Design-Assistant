import os
from typing import Literal

import pandas as pd
from dotenv import load_dotenv
from pinecone import Pinecone, SearchQuery, ServerlessSpec

# Load environment variables
load_dotenv()


class PineconeService:
  """Allows to embed and upsert data into Pinecone vector DB and query it"""

  def __init__(self):
    """
    Initialize the connection to Pinecone and its indexes (sparse and dense)
    """
    self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    self.index_dense = self.pc.Index("nndm-dense")
    self.index_sparse = self.pc.Index("nndm-sparse")

  def upsert_dataframe_to_pinecone(
    self,
    df: pd.DataFrame,
    index_name: Literal["nndm-dense", "nndm-sparse"],
    col_to_embed: str,
    namespace: str = "__base_knowledge__",
    batch_size: int = 250,
    cols_as_metadata: list[str] = [],
  ) -> None:
    """
    Upserts rows from a DataFrame into Pinecone dense index in batches.

    Args:
        df: DataFrame containing data to upsert.
        index_name: Name of the Pinecone index to upsert to ("nndm-dense" or "nndm-sparse").
        col_to_embed: Column name in DataFrame containing text to embed.
        namespace: Pinecone namespace to use. Defaults to "__base_knowledge__".
        batch_size: Number of rows to upsert in each batch. Defaults to 250.
        cols_as_metadata: List of column names to include as metadata. Defaults to [].

    Returns:
        None

    """
    total_rows = len(df)

    for start_idx in range(0, total_rows, batch_size):
      # prepare batch
      end_idx = min(start_idx + batch_size, total_rows)
      batch = df.iloc[start_idx:end_idx]
      batch_vectors = []
      for _, row in batch.iterrows():
        vector = {
          "id": f"{row['arxiv_id']}-abstract",  # Unique identifier for abstracts
          "embedded_text": row[
            col_to_embed
          ],  # source_text should be named "embedded_text" to match the field_map in index (both indexes have the same field map)
          # everything after those two fields is treated as metadata
          "type": "abstract",
          **{
            f"{col}": row[col] for col in cols_as_metadata
          },  # use dictionary unpacking to add metadata fields
        }
        batch_vectors.append(vector)

      # Upsert the batch of vectors to Pinecone
      try:
        if index_name == "nndm-sparse":
          self.index_sparse.upsert_records(namespace=namespace, records=batch_vectors)
          print(f"Upserted rows {start_idx} to {end_idx} into Pinecone sparse index.")
        else:
          self.index_dense.upsert_records(namespace=namespace, records=batch_vectors)
          print(f"Upserted rows {start_idx} to {end_idx} into Pinecone dense index.")

      except Exception as e:
        print(f"Error upserting rows {start_idx} to {end_idx} into Pinecone dense index: {e}")


#   def vector_search_baseline(
#     self,
#     search_text: str,
#     top_k: int = 10,
#     namespace: str = "__base_knowledge__",
#     index_name: Literal["nndm-dense", "nndm-sparse"] = "nndm-dense",
#   ):
#     """

#     Conducts a vector search on the specified Pinecone index (dense or sparse) using the provided search text.

#     Args:
#         search_text: The text to search for.
#         top_k: The number of top results to return. Defaults to 10.
#         namespace: The Pinecone namespace to search within. Defaults to "__base_knowledge__".
#         index_name: The name of the Pinecone index to search ("nndm-dense" or "nndm-sparse"). Defaults to "nndm-dense".

#     Returns:
#         dict: The search results from Pinecone.

#     """
#     if index_name == "nndm-sparse":
#       results = self.index_sparse.search(
#         namespace=namespace,
#         query=SearchQuery(inputs={"text": search_text}, top_k=top_k),
#         fields=["title", "abstract", "embedded_text"],
#       )
#     else:
#       results = self.index_dense.search(
#         namespace=namespace,
#         query=SearchQuery(inputs={"text": search_text}, top_k=top_k),
#         fields=["title", "abstract", "embedded_text"],
#       )

#     return results

#   def deduplicate(self, sparse_results, dense_results):
#     # Deduplicates results from sparse and dense indexes
#     deduped_hits = {
#       hit["_id"]: hit for hit in sparse_results["result"]["hits"] + dense_results["result"]["hits"]
#     }.values()
#     # Transform to format for reranking
#     result = [
#       {
#         "id": hit["_id"],
#         "title": hit["fields"]["title"],
#         "embedded_text": hit["fields"]["embedded_text"],
#       }
#       for hit in deduped_hits
#     ]
#     return result

#   def rerank(self, query, results, top_n=5):
#     # Calls a reranking model hosted on Pinecone, returning the top_n results ordered by relevance to the query
#     result = self.pc.inference.rerank(
#       # free-tier reranker
#       model="bge-reranker-v2-m3",
#       query=query,
#       documents=results,
#       rank_fields=[
#         "embedded_text"
#       ],  # field form results dict to use for reranking # basically always the embedded text
#       top_n=10,
#       return_documents=True,
#       parameters={"truncate": "END"},
#     )
#     return result

#   def cascading_retrieval(self, query, sparse_index, dense_index, top_k=10, top_n=5):
#     # Conducts a search over sparse and dense indexes, followed by deduplication and reranking
#     # Returns a list of top_n results ordered by relevance to the query

#     # query dense
#     dense_results = self.query_dense(query, top_k)
#     # query sparse
#     sparse_results = self.query_sparse(query, top_k)
#     # dedupe results
#     deduped_results = self.deduplicate(sparse_results, dense_results)
#     # rerank results
#     reranked_results = self.rerank(query, deduped_results, top_n)
#     reranked_results = reranked_results.data

#     return reranked_results
