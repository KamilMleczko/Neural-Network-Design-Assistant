from ...core.services import llm, exa
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from .structured_outputs import ArticleIds
from ...core.states import State
import json


def infer_repo_urls_node(state: State):
  message_history = state["messages"]
  articles_metadata = state["current_articles_metadata"]
  query_transformer_llm = llm.with_structured_output(ArticleIds)
  system_message = SystemMessage(
    content=f"""
      You are responsible for infering which articles is user referring to when he is asking about code repositories.
      Code repositories mentioned by user are connected to one of suggested articles earlier in the conversation.
      Based on the user's recent messages (especially the last one), write out a list of article id's that user is referring to.

      You can see the descriptions and id's of articles suggested earlier within their metadata below.
      {json.dumps(articles_metadata, indent=2)}
    """
  )
  response = query_transformer_llm.invoke([system_message] + message_history)
  return {"article_ids_for_repo_summaries": response.article_ids}  # type: ignore
  

def summarize_repo_contents_node(state: State):

  # 1. Fetch repository contents
  mentioned_article_ids = state.get("article_ids_for_repo_summaries", None)
  current_articles_metadata = state.get("current_articles_metadata", None)
  print(f"PIERDOLEEEEEEEEEEEEEEEEEE {mentioned_article_ids}, CIE {current_articles_metadata == None}")
  if current_articles_metadata is None or mentioned_article_ids is None:
    raise ValueError("State is missing required article metadata or mentioned article ids.") 

  relevant_article_url_info = []
  for article in current_articles_metadata:
      if article["_id"] in mentioned_article_ids:
        url_list = article["repo_url_list"][:3]
        result = exa.get_contents(
          url_list,
          livecrawl = "always"
        )
        results = result.results 
        relevant_article_url_info.append({
            "id": article["_id"],
            "title": article["title"],
            "repo_info": [{"url": res.url, "content": res.text} for res in results]
        })

  # 2. Summarize repository contents
  system_message = SystemMessage(
    content=f"""
      Your task is to generate a concise summary of contents for each repository associated with the articles provided below.
      
      Article-repo info structure consists of a list of articles:
      - Each article contains its 'id', 'title', and 'repo_info'.
      - 'repo_info' is a list of repositories, each containing its 'url' and 'content' (raw fetched data).
      
      Instructions:
      1. Identify and extract project information primarily from the README content found within the 'content' field.
      2. Exclude source code, directory structures, or generic license text unless they are essential to understanding the project's core purpose.
      3. Use the message history below and for each repo determine if it is relevant to user's ML problem, if it is - how?, if its not - state that as well, and explain why.
      4. Use the following Markdown structure for your response:

      ## 📄 [Article Title] 
      
      ### 🛠️ [Repository Name]: [URL]
      **🎯 Project Goal:** [Exhaustive 3-5 sentence summary of the project's purpose and implementation.]

      **💻 Tech Stack:** [e.g., Python, TensorFlow, React, SQL]

      **🧠 Relevance to your problem:** [Explain how this repository relates to the user's machine learning problem.]

      --- (Use a horizontal rule to separate different articles)
      
      Article-repo data:
      {json.dumps(relevant_article_url_info, indent=2)}
    """
  )
  message_history = state["messages"]
  response = llm.invoke([system_message] + message_history)
  return {"messages": [AIMessage(content=response.content)]}

    


