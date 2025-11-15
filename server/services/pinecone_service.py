import sys
from pathlib import Path

server_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(server_root))
import os
from typing import Any, Literal, cast
import pandas as pd
from dotenv import load_dotenv
from pinecone import Pinecone, SearchQuery
from services.scientific_pdf_loader import ScientificPDFLoader

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
    namespace: str,
    index_name: Literal["nndm-dense", "nndm-sparse"],
    col_to_embed: str,
    batch_size: int = 250,
    cols_as_metadata: list[str] = [
      "arxiv_id",
      "title",
      "year",
      "article_url",
      "repo_url_list",
      "authors_list",
      "citations",
    ],
  ) -> None:
    """
    Upserts rows from a DataFrame into Pinecone dense index in batches.

    Args:
        df: DataFrame containing data to upsert.
        namespace: Pinecone namespace to upsert into (e.g., "__abstracts__" or "__chunks__").
        index_name: Name of the Pinecone index to upsert to ("nndm-dense" or "nndm-sparse").
        col_to_embed: Column name in DataFrame containing text to embed.
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

  def upsert_chunked_pdfs(
    self,
    df: pd.DataFrame,
    namespace: str,
    batch_size: int = 250,
  ) -> None:
    """
    Processes PDFs from DataFrame, chunks them, and upserts chunks to Pinecone dense index on-the-fly.

    Args:
        df: DataFrame with columns: arxiv_id, title, article_url
        namespace: Pinecone namespace to upsert into (e.g., "__chunks__")
        batch_size: Number of chunks to upsert in each batch
        cols_as_metadata: List of column names to include as metadata

    Returns:
        None

    """
    loader = ScientificPDFLoader(extract_tables=True)

    total_pdfs = len(df)
    total_chunks_processed = 0
    total_pdfs_processed = 0
    total_pdfs_failed = 0

    batch_vectors = []
    failed_records = pd.DataFrame(columns=df.columns)  # Empty DataFrame for failed rows

    print(f"📊 Processing {total_pdfs} PDFs and upserting chunks to Pinecone...")

    for _idx, row in df.iterrows():
      try:
        arxiv_id = row["arxiv_id"]
        article_title = row["title"]
        pdf_url = cast("str", row["article_url"])

        print(f"Processing: {arxiv_id}")
        print(f"  Title: {article_title[:80]}...")

        chunks = loader.parse_pdf(pdf_url)

        print(f" ✅ Created {len(chunks)} chunks")

        # Process each chunk
        for chunk_num, chunk in enumerate(chunks):
          clean_text = chunk["content"].strip().replace("\n", " ")

          # Create vector for this chunk
          vector = {
            "id": f"{arxiv_id}-chunk_{chunk_num}",
            "embedded_text": clean_text,  # Text to embed
            "arxiv_id": arxiv_id,
            "article_title": article_title,
            "section_title": chunk["heading"],
            "page": chunk["page_number"],
          }

          batch_vectors.append(vector)
          total_chunks_processed += 1

          # If batch is full, upsert it
          if len(batch_vectors) >= batch_size:
            try:
              self.index_dense.upsert_records(namespace=namespace, records=batch_vectors)
              print(f"  ⬆️  Upserted batch of {len(batch_vectors)} chunks to Pinecone")
            except Exception as e:
              print(f"  ❌ Error upserting batch to Pinecone: {e}")

            # Clear batch
            batch_vectors = []

        total_pdfs_processed += 1
      except Exception as e:
        print(f"  ❌ Error processing PDF {row.get('arxiv_id', '?')}: {e}")
        total_pdfs_failed += 1
        # Append failed record to DataFrame
        failed_records = pd.concat([failed_records, pd.DataFrame([row])], ignore_index=True)
        continue  # Move on to next PDF

    # Upsert any remaining chunks in the final batch
    if batch_vectors:
      try:
        self.index_dense.upsert_records(namespace=namespace, records=batch_vectors)
        print(f"\n⬆️  Upserted final batch of {len(batch_vectors)} chunks to Pinecone")
      except Exception as e:
        print(f"\n❌ Error upserting final batch to Pinecone: {e}")

    # Save failed records if any
    if not failed_records.empty:
      try:
        failed_records_original = pd.read_parquet("failed_records.parquet")
        failed_records = pd.concat([failed_records_original, failed_records], ignore_index=True)
        failed_records.to_parquet("failed_records.parquet", index=False)
        print(f"\n💾 Saved {len(failed_records)} failed records to 'failed_records.parquet'")
      except Exception as e:
        print(f"\n❌ Error saving failed records to Parquet: {e}")

    # Print summary
    print("\n" + "=" * 60)
    print("✅ Processing Complete!")
    print(f"PDFs successfully processed: {total_pdfs_processed}")
    print(f"PDFs failed: {total_pdfs_failed}")
    if total_pdfs_processed > 0:
      print(f"Average chunks per PDF: {total_chunks_processed / total_pdfs_processed:.1f}")

  def _vector_search_basic(
    self,
    search_text: str,
    namespace: str,
    index_name: Literal["nndm-dense", "nndm-sparse"],
    filters: dict | None = None,
    limit: int = 10,
  ):
    """
    Conducts a vector search on the specified Pinecone index (dense or sparse) using the provided search text.

    Args:
        search_text: The text to search for.
        namespace: The Pinecone namespace to search within (either "__abstracts__" or "__chunks__").
        index_name: The name of the Pinecone index to search ("nndm-dense" or "nndm-sparse"). Defaults to "nndm-dense".
        filters: Optional filters to apply to the search (in form of json). Defaults to None.
        limit: The number of top results to return. Defaults to 10.

    Returns:
        dict: The search results from Pinecone.

    """
    if index_name == "nndm-sparse":
      results = self.index_sparse.search(
        namespace=namespace,
        query=SearchQuery(inputs={"text": search_text}, top_k=limit, filter=filters),
      )
    else:
      results = self.index_dense.search(
        namespace=namespace,
        query=SearchQuery(inputs={"text": search_text}, top_k=limit, filter=filters),
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

  def vector_search(
    self,
    search_text: str,
    namespace: str,
    index_name: Literal["nndm-dense", "nndm-sparse"],
    filters: dict | None = None,
    limit: int = 10,
    fields: list[str] | None = None,
  ):
    """
    Conducts a vector search on the specified Pinecone index (dense or sparse) using the provided search text.

    Args:
        search_text: The text to search for.
        namespace: The Pinecone namespace to search within (either "__abstracts__" or "__chunks__").
        index_name: The name of the Pinecone index to search ("nndm-dense" or "nndm-sparse"). Defaults to "nndm-dense".
        filters: Optional filters to apply to the search (in form of json). Defaults to None.
        limit: The number of top results to return. Defaults to 10.
        fields: List of fields to retrieve from the index. If not specified, defaults to all present fields.

    Returns:
        dict: The search results from Pinecone.

    """
    if index_name == "nndm-sparse":
      results = self.index_sparse.search(
        namespace=namespace,
        query=SearchQuery(inputs={"text": search_text}, top_k=limit, filter=filters),
      )
    else:
      results = self.index_dense.search(
        namespace=namespace,
        query=SearchQuery(inputs={"text": search_text}, top_k=limit, filter=filters),
      )
    hits = results["result"]["hits"]
    filtered_results: list[dict[str, Any]] = []
    for result in hits:
      doc = result["fields"]
      filtered_doc = {key: doc.get(key) for key in fields} if fields else doc
      filtered_results.append(filtered_doc)
    return filtered_results

  def hybrid_search(
    self,
    query: str,
    namespace: str,
    filters: dict | None = None,
    candidates=10,
    limit=5,
    fields: list[str] | None = None,
  ):
    """
    Conducts a search over sparse and dense indexes, followed by deduplication and reranking

    Args:
        query: The search query string.
        namespace: The Pinecone namespace to search within( either "__abstracts__" or "__chunks__")
        candidates: The number of top results to retrieve from each index before deduplication. Defaults to 10.
        filters: Optional filters to apply to the search (in form of json). Defaults to None.
        limit: The number of top results to return after reranking. Defaults to 5.
        fields: List of fields to retrieve from the indexes. If not specified, defaults to all present fields.

    Returns:
        list: The final reranked search results.

    """
    dense_results = self._vector_search_basic(
      query, index_name="nndm-dense", namespace=namespace, limit=candidates, filters=filters
    )
    sparse_results = self._vector_search_basic(
      query, index_name="nndm-sparse", namespace=namespace, limit=candidates, filters=filters
    )
    # dedupe results
    # print(f"sparse results: {sparse_results}")
    deduped_results = self._deduplicate(sparse_results, dense_results)
    # rerank results
    reranked_results = self._rerank(query, deduped_results, limit=limit)

    filtered_results: list[dict[str, Any]] = []
    for result in reranked_results:
      doc = result["document"]
      filtered_doc = {key: doc.get(key) for key in fields} if fields else doc
      filtered_results.append(filtered_doc)
    return filtered_results
