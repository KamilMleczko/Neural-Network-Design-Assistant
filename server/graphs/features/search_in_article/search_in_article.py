from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from .structured_outputs import ArticleQueries
from ...core.states import State
from ...core.services import llm, vector_db
import json


def transform_query_node_chunks(state: State):
  relevant_articles = state.get("current_articles_metadata", None)
  if relevant_articles is None:
    raise ValueError(
      "State is missing 'current_articles_metadata'. Check the preceding vector search step."
    )

  article_list = []
  for i, article in enumerate(relevant_articles):
    title = article.get("title")
    arxiv_id = article.get("arxiv_id")
    relevance_summary = article.get("relevance_summary")
    print(f"Article {i}: title={title}, arxiv_id={arxiv_id}, summary={relevance_summary}")
    if title is None or arxiv_id is None or relevance_summary is None:
      raise ValueError(f"Article at index {i} is missing 'title', 'arxiv_id', or 'summary'.")

    article_list.append({"title": title, "arxiv_id": arxiv_id, "summary": relevance_summary})
  article_list_str = json.dumps(article_list, indent=2)
  query_transformer_llm = llm.with_structured_output(ArticleQueries)
  system_message = SystemMessage(
    content="""
    You are a query transformation model. Your purpose is to convert messy user requests
    into optimized search queries for searching within scientific article chunks. 
    Your tasks also include identifying which articles from a provided list the user is referring to.

    Rules:
    - Produce a concise, technical search query and identify relevant articles.
    - Keep relevant keywords from the user.
    - Remove personal context and irrelevant details.
    - Follow the structured output schema exactly.
    """
  )
  prompt = HumanMessage(
    content=f"""
  Based on the message history (especially the last user's message), determine what information from scientific article(s) the user was seeking in his last question.
  Your tasks:
  1. Identify which article(s) from the list below the user may be referring to. One arxiv id per article.
  2. Return a list of "arxiv_id": string, "query": string  objects, one for each relevant article.

  Allowed articles (title + arxiv_id + summary):
  {article_list_str}

  """
  )
  message_history = state["messages"]
  response = query_transformer_llm.invoke([system_message] + message_history + [prompt])
  articles_dicts = []
  for article_query in response.article_queries:  # type: ignore
    articles_dicts.append({"arxiv_id": article_query.arxiv_id, "query": article_query.query})

  return {"currently_selected_articles": articles_dicts}  # type: ignore


def vector_search_chunks_node(state: State):
  currently_selected_articles = state.get("currently_selected_articles", None)

  if currently_selected_articles is None:
    raise ValueError(
      "State is missing 'currently_selected_articles'. Check the preceding LLM step."
    )

  relevant_articles_contents = []
  for article in currently_selected_articles:
    arxiv_id = article.get("arxiv_id", None)
    query = article.get("query", None)

    if arxiv_id is None or query is None:
      raise ValueError(f"Article with arxiv_id {arxiv_id} is missing 'arxiv_id' or 'query'.")
    docs = vector_db.vector_search(
      search_text=query,
      namespace="__chunks__",
      index_name="nndm-dense",
      filters={"arxiv_id": arxiv_id},
      fields=["title", "section_title", "page", "embedded_text"],
      limit=5,
    )
    if len(docs) == 0:
      print(f"No relevant chunks found for article {arxiv_id} with query '{query}'")
      continue
    title = docs[0].get("title", "Unknown Title")
    chunks_relevant_to_article = {"title": title, "chunk_metadata": []}
    for doc in docs:
      embedded_text = doc.get("embedded_text", None)
      if embedded_text is None:
        raise ValueError(f"Document in article {arxiv_id} is missing 'embedded_text'.")
      chunk_metadata = {
        "section_title": doc.get("section_title", "Unknown"),
        "page": doc.get("page", "Unknown"),
        "relevant_text": embedded_text,
      }
      chunks_relevant_to_article["chunk_metadata"].append(chunk_metadata)
    relevant_articles_contents.append(chunks_relevant_to_article)

  return {"relevant_article_contents": relevant_articles_contents}


def answer_question_based_on_chunks_node(state: State):
  relevant_article_contents = state.get("relevant_article_contents", None)
  if relevant_article_contents is None:
    raise ValueError(
      "State is missing 'relevant_article_contents'. Check the preceding vector search step."
    )
  relevant_article_contents_str = json.dumps(relevant_article_contents, indent=2)
  print("\n --- Relevant Article Contents for LLM --- \n")
  print(f"\n{relevant_article_contents_str}")
  print("\n --- End of Relevant Article Contents for LLM --- \n")
  system_prompt = SystemMessage(
    content="""
    You are an expert assistant specialized in answering questions about scientific articles.
    
    Your task:
    - Answer the user's question using ONLY the provided article chunks
    - Cite specific sections/pages when referencing information
    - If multiple articles are provided, clearly distinguish which information comes from which article
    - If the chunks don't contain the answer, state this clearly
    - Take into account the conversation history to understand context and references
    
    Response guidelines:
    - Be accurate and concise
    - Reference section titles and page numbers when citing: "According to Section 3.2 (page 5)..." (use **bold** formatting there)
    - If comparing multiple articles, use clear headings or structure
    - Maintain technical accuracy while being accessible
    - Use emotes sparingly to enhance clarity and engagement
    """
  )
  prompt = HumanMessage(
    content=f"""
    Based on the conversation history and the article chunks provided below, answer the user's most recent question.

    **DATA STRUCTURE EXPLANATION:**
    The data below contains {len(relevant_article_contents)} article(s), each with multiple relevant text chunks.
    - Each article has a title
    - Each chunk includes:
      • Section title (where in the article this content appears)
      • Page number (for citation purposes)
      • Content (the actual text from that section)

    **ARTICLE CHUNKS:**
    {relevant_article_contents_str}

    **INSTRUCTIONS:**
    1. Use the information from the chunks above (you can fill the gaps with your own knowledge if needed)
    2. When citing information, reference: Article title + Section + Page
      Example: "According to the BERT paper (Section 3.1, page 4)..."
    3. If the user asked about multiple articles, organize your answer clearly
    4. If the chunks don't contain sufficient information to answer, say so explicitly
    5. Be specific and technical when appropriate, but keep explanations clear

    Now answer the user's question based on this information.
    """
  )
  msg_history = state["messages"]
  recent_history = msg_history[-5:]
  response = llm.invoke([system_prompt] + recent_history + [prompt])
  return {"messages": [AIMessage(content=response.content)]}
