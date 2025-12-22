from ...core.states import State
from ...core.services import llm
from .structured_outputs import MessageType
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage


def general_response_node(state: State):
  system_prompt = SystemMessage(
    content="""
    You are an ML study and design assistant. Your role is to explain machine learning concepts,
    suggest approaches, and provide resources related to machine learning research and projects.
    
    **Behavior Guidelines:**
    - Take into account the message history when formulating your response.
    - Try to judge the user's expertise level based on their messages and adjust your explanations accordingly.
    - For topics unrelated to ML or AI: Politely redirect to your expertise:
      Example: "Your question seems to be outside my area of expertise. I'm specialized in machine learning topics. How can I assist you with that?"
    """
  )
  msg_history = state["messages"]
  recent_history = msg_history  # all messages context
  response = llm.invoke([system_prompt] + recent_history)
  return {"messages": [AIMessage(content=response.content)]}


def classify_message_node(state: State):
  message_history = state["messages"]
  classifier_llm = llm.with_structured_output(MessageType)  # add structure output to this response
  system_message = SystemMessage(
    content=f"""
      You are an **Expert Message Classifier**.
      Your sole task is to analyze the converstion flow in order to determine what functionality to use next in order to best assist the user.
      
      There are 4 possible functionalities to choose from:

      1.Relevant Article Suggestions - User is describing some machine learning problem, or asks directly for suggestions of articles. 
      
      2.Article Contents Analysis
        When to use it:
        - User is asking specific questions about one or more OF ALREADY SUGGESTED ARTICLES 
        - User asks you to compare or relate two or more OF ALREADY SUGGESTED ARTICLES 
        When NOT to use it:
        - User is asking questions unrelated to contents of articles, or asking questions about article that was not within earlier suggestions.
        - NEVER use this functionality at the beginning of a conversation, as there are no articles suggested yet.
      
      3.Repository Summaries - User is asking for summaries/explanations of code repositories,
         When to use it:
          - User is specifically asking about code repositories connected to one of ALREADY SUGGESTED ARTICLES.
         When NOT to use it:
          - User is asking about code repositories unrelated to any of the articles suggested earlier.
          - NEVER use this functionality at the beginning of a conversation, as there are no articles suggested yet.

      4.Other - The user's message does not fit into the above categories. Most often you will use it when user asks you to explain some general ML concept, or asks irrelevant questions.
      
      **Behavior Guidelines:**
      You will be passed full conversation history, most recent user messages is most relevant but take into account prior conversation flow.
      You must use the provided structured output format and **only** output the classification.
      Do not generate any conversational text, explanations, or prose outside of the required output structure.
    """
  )

  response = classifier_llm.invoke([system_message] +  message_history)
  # print(f"Classified message type: {response.message_type}") # type: ignore
  return {"message_type": response.message_type}  # type: ignore


def router(state: State):
  msg_type = state["message_type"]
  if msg_type == "relevant_article_suggestions":
    return {"next": "transform_query_node_abstract"}
  if msg_type == "article_contents_analysis":
    return {"next": "transform_query_node_chunks"}
  if msg_type == "repository_summaries":
    return {"next": "infer_repo_urls_node"}
  if msg_type == "other":
    return {"next": "general_response_node"}
  raise ValueError(f"Unknown message type: {msg_type}")
