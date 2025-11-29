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
  last_message = state["messages"][-1]
  classifier_llm = llm.with_structured_output(MessageType)  # add structure output to this response
  system_message = SystemMessage(
    content=f"""
      You are an **Expert Message Classifier**.
      Your sole task is to analyze the user's last message and categorize its content by strictly selecting *one* of the predefined options.
      You must use the provided structured output format and **only** output the classification.
      Do not generate any conversational text, explanations, or prose outside of the required output structure.
    """
  )
  user_message = HumanMessage(content=last_message.content)

  response = classifier_llm.invoke([system_message, user_message])
  # print(f"Classified message type: {response.message_type}") # type: ignore
  return {"message_type": response.message_type}  # type: ignore


def router(state: State):
  msg_type = state["message_type"]
  if msg_type == "ml_problem_description":
    return {"next": "transform_query_node_abstract"}
  if msg_type == "question_about_article":
    return {"next": "transform_query_node_chunks"}
  if msg_type == "other":
    return {"next": "general_response_node"}
  raise ValueError(f"Unknown message type: {msg_type}")
