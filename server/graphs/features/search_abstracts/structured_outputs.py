from pydantic import BaseModel, Field


class TransformedQueryAbstract(BaseModel):
  """
  Defines the required output structure for transformed queries used in searching article abstracts.
  """

  transformed_query_abstract: str = Field(
    ...,
    description="A concise, technical, and optimized query for searching scientific article abstracts.",
  )


class ArticleSummaries(BaseModel):
  """
  Defines the required output structure: a list of summary strings.
  """

  summaries: list[str] = Field(
    description="A list of sentence summaries, each explaining how one article relates to the user's query, formatted in Markdown."
  )
