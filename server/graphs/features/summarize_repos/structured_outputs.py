from pydantic import BaseModel, Field

# for repo fetching purposes
class ArticleIds(BaseModel):
  """
  Defines the required output structure: a list of relevant article id's
  """

  article_ids: list[str] = Field(
    description="A list of relevant article id's, each identifying an article the user is referring to."
  )
