from pydantic import BaseModel, Field


class ArticleQuery(BaseModel):
  arxiv_id: str = Field(..., description="The arxiv_id of a relevant article.")
  query: str = Field(
    ...,
    description="A concise, technical query string optimized for searching within this article's chunks.",
  )


class ArticleQueries(BaseModel):
  article_queries: list[ArticleQuery] = Field(
    ..., description="A list of article-specific queries, one per relevant article."
  )
