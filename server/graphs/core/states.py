from typing import Annotated, Any, TypedDict
from langgraph.graph.message import add_messages
from langchain_core.messages import AnyMessage
from ..features.search_in_article.structured_outputs import ArticleQuery


class State(TypedDict):  # main state shared across all nodes
  messages: Annotated[list[AnyMessage], add_messages]
  current_articles_metadata: list[dict[str, Any]] | None
  relevant_article_contents: list[dict[str, Any]] | None
  currently_selected_articles: list[dict[str, Any]] | None
  message_type: str | None
  transformed_query_abstract: str | None  # for searching through article abstracts
  transformed_query_chunks: str | None  # for searching within article by chunks
  formatted_articles_data: str | None
  article_ids_for_repo_summaries: list[str] | None  # for summarize_repos feature
