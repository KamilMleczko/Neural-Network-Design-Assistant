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
    cols_as_metadata: list[str] = [
      "arxiv_id",
      "title",
      "year",
      "article_url",
      "repo_url_list",
      "authors_list",
    ],
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

  def _vector_search(
    self,
    search_text: str,
    index_name: Literal["nndm-dense", "nndm-sparse"],
    limit: int = 10,
    namespace: str = "__base_knowledge__",
  ):
    """
    Conducts a vector search on the specified Pinecone index (dense or sparse) using the provided search text.

    Args:
        search_text: The text to search for.
        top_k: The number of top results to return. Defaults to 10.
        namespace: The Pinecone namespace to search within. Defaults to "__base_knowledge__".
        index_name: The name of the Pinecone index to search ("nndm-dense" or "nndm-sparse"). Defaults to "nndm-dense".
        limit: The number of top results to return. Defaults to 10.

    Returns:
        dict: The search results from Pinecone.

    """
    if index_name == "nndm-sparse":
      results = self.index_sparse.search(
        namespace=namespace,
        query=SearchQuery(inputs={"text": search_text}, top_k=limit),
      )
    else:
      results = self.index_dense.search(
        namespace=namespace,
        query=SearchQuery(inputs={"text": search_text}, top_k=limit),
      )

    return results

  def _deduplicate(self, sparse_results, dense_results):
    # Deduplicates results from sparse and dense indexes
    deduped_hits = {
      hit["_id"]: hit for hit in sparse_results["result"]["hits"] + dense_results["result"]["hits"]
    }.values()
    sorted_hits = sorted(deduped_hits, key=lambda x: x["_score"], reverse=True)
    # Transform to format for reranking
    flattened_result = [
      {
        "_id": hit.get("_id"),
        #'embedded_text': hit['fields']['embedded_text'],
        "_score": hit.get("_score"),
        **hit.get("fields", {}),  # unpack all fields from the nested 'fields' dictionary
      }
      for hit in sorted_hits
    ]

    return flattened_result

  def _rerank(self, query, results, limit=5):
    # Calls a reranking model hosted on Pinecone, returning the top_n results ordered by relevance to the query
    result = self.pc.inference.rerank(
      # free-tier reranker
      model="bge-reranker-v2-m3",
      query=query,
      documents=results,
      rank_fields=["embedded_text"],
      top_n=limit,
      return_documents=True,
      parameters={"truncate": "END"},
    )
    return result.data

  def hybrid_search(self, query, candidates=10, limit=5, fields: list[str] | None = None):
    """
    Conducts a search over sparse and dense indexes, followed by deduplication and reranking

    Args:
        query: The search query string.
        candidates: The number of top results to retrieve from each index before deduplication. Defaults to 10.
        limit: The number of top results to return after reranking. Defaults to 5.
        fields: List of fields to retrieve from the indexes. If not specified, defaults to all present fields.

    Returns:
        list: The final reranked search results.

    """
    dense_results = self._vector_search(query, index_name="nndm-dense", limit=candidates)
    sparse_results = self._vector_search(query, index_name="nndm-sparse", limit=candidates)
    # dedupe results
    deduped_results = self._deduplicate(sparse_results, dense_results)
    # rerank results
    reranked_results = self._rerank(query, deduped_results, limit=limit)

    filtered_results = []
    for result in reranked_results:
      doc = result["document"]
      filtered_doc = {key: doc.get(key) for key in fields} if fields else doc
      filtered_results.append(filtered_doc)
    return filtered_results
