from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from .structured_outputs import TransformedQueryAbstract, ArticleSummaries
import json
from ...core.states import State
from ...core.services import llm, vector_db


def transform_query_node_abstract(state: State):
  query_transformer_llm = llm.with_structured_output(TransformedQueryAbstract)
  system_message = SystemMessage(
    content="""
      You are a vector search query creator.
      Based on the user's recent messages, deduce what he is looking for in scientific articles.
      Prepare a short, precise description that will be used for vector search on article abstracts.
      Make sure to include keywords if user mentions any.
      Remove any personal context or additional information that won't benefit vector search.
    """
  )
  prompt = HumanMessage(
    content="""
      Prepare an optimized search query for searching through scientific article abstracts based on the user's recent messages. 
      Especially the last one containing his direct request).
    """
  )
  original_user_query = state["messages"][-1].content
  recent_messages = state["messages"][-5:]  # last 5 messages context
  response = query_transformer_llm.invoke([system_message] + recent_messages + [prompt])
  print(f"Transformed query: {response.transformed_query_abstract}")  # type: ignore
  return {"transformed_query_abstract": response.transformed_query_abstract}  # type: ignore


def vector_search_abstracts_node(state: State):
  transformed_query_abstract = state.get("transformed_query_abstract", None)
  if transformed_query_abstract is None:
    raise ValueError("State is missing 'transformed_query_abstract'. Check the preceding LLM step.")

  # print(f"Performing vector search with query: {transformed_query_abstract}")
  relevant_articles = vector_db.hybrid_search(
    query=transformed_query_abstract,
    namespace="__abstracts__",
    candidates=10,
    limit=5,
  )
  return {"current_articles_metadata": relevant_articles}


def relate_articles_to_query_node(state: State):
  relevant_articles = state.get("current_articles_metadata", None)
  if relevant_articles is None:
    raise ValueError(
      "State is missing 'current_articles_metadata'. Check the preceding vector search step."
    )

  articles_for_llm = []
  for i, article in enumerate(relevant_articles):
    title = article.get("title")
    abstract = article.get("embedded_text")
    if title is None or abstract is None:
      raise ValueError(f"Article at index {i} is missing 'title' or 'embedded_text'.")
    articles_for_llm.append({"title": title, "abstract": abstract})
  articles_context_str = json.dumps(articles_for_llm, indent=2)

  system_message = SystemMessage(
    content="""
      You are an expert at relating scientific articles to specific machine learning problems. 
      Given a user's machine learning problem description and a set of article abstracts, 
      Identify and summarize how each article is relevant to the user's problem. 
      Format your response as if you were explainig to the user directly (use "you", "yours" etc.).
      Mention what it provides: dataset, benchmark, ML architecture, method, etc. 
      Focus on key insights, methods, or findings from the articles that directly address the user's needs. 
      """
  )

  user_problem_description = state["messages"][-1].content
  prompt = HumanMessage(
    content=f"""
      **Original User's ML Problem:**
      "{user_problem_description}"

      **Article Data (Title and Abstract):**
      {articles_context_str}

      **INSTRUCTION:**
      For each article in the provided list, generate a **"relevance_summary"**. This summary must be a clean **3-4 sentence explanation** that addresses:
      1.  What the article is generally about (e.g., its core method or finding).
      2.  How it specifically relates to the **Original User's ML Problem**.
      
      The summary must be in **Markdown format** (for potential bolding or emphasis), but do not include extra Markdown headings or bullet points.
      
      For every article return **one summary** string and keep them in a List as specified in Structured Output.
      Make sure to keep summaries in the same order as the articles were provided.
      """
  )
  summarizer_llm = llm.with_structured_output(ArticleSummaries)
  response = summarizer_llm.invoke([system_message, prompt])
  summaries = response.summaries  # type: ignore
  # print(summaries)
  if len(relevant_articles) != len(summaries):
    raise ValueError("Number of summaries does not match number of articles.")

  for i in range(len(relevant_articles)):
    relevant_articles[i]["relevance_summary"] = summaries[i]

  return {"current_articles_metadata": relevant_articles}


def format_articles_metadata_node(state: State):
  relevant_articles = state.get("current_articles_metadata", None)
  if relevant_articles is None:
    raise ValueError(
      "State is missing 'current_articles_metadata'. Check the preceding vector search step."
    )
  if len(relevant_articles) == 0:
    return None

  markdown_parts = []
  markdown_parts.append("## 📚 I've found some scientific articles relevant to your problem:")
  markdown_parts.append("---")

  for i, article in enumerate(relevant_articles):
    # Safely extract core data
    arxiv_id = article.get("arxiv_id")
    title = article.get("title")
    year = article.get("year")
    citations = article.get("citations")
    url = article.get("article_url")
    abstract = article.get("embedded_text")
    relevance_summary = article.get("relevance_summary")

    if not all([title, year, citations, url, abstract, relevance_summary]):
      raise ValueError(f"Article {arxiv_id} is missing required fields.")

    repo_urls = article.get("repo_url_list", [])
    repo_urls_cut = repo_urls[0:3]
    repo_links = "\n".join(
      [f"- [Code Repository {j + 1}]({repo})" for j, repo in enumerate(repo_urls_cut)]
    )

    authors_list = article.get("authors_list", "N/A")
    authors_str = ", ".join(authors_list)

    # Build the Markdown string for this article
    article_markdown = (
      f""
      f"### {i + 1}. {title} ({year})\n"
      f"**Authors:** {authors_str}\n"
      f"**Citations:** {citations:,}\n"
      f"**Insights**\n{relevance_summary}\n"
      f"**Source URL:** {url}\n\n"
      f"\n**Code Repositories:**\n{repo_links}\n"
    )

    markdown_parts.append(article_markdown)
    markdown_parts.append("---")
  markdown_parts.append(
    "Are you curious about contents of any of these articles or would you like me to suggest some datasets ? Feel free to ask!"
  )
  full_response = "\n".join(markdown_parts)
  return {"messages": [AIMessage(content=full_response)]}
