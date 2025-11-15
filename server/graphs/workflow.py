from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage
from .features.general_purpose.general_purpose import (
  classify_message_node,
  router,
  general_response_node,
)
from .core.states import State
from .features.search_abstracts.search_abstracts import (
  transform_query_node_abstract,
  vector_search_abstracts_node,
  relate_articles_to_query_node,
  format_articles_metadata_node,
)
from .features.search_in_article.search_in_article import (
  transform_query_node_chunks,
  vector_search_chunks_node,
  answer_question_based_on_chunks_node,
)

graph_builder = StateGraph(State)
# features/general_purpose
graph_builder.add_node("classifier", classify_message_node)
graph_builder.add_node("router", router)
graph_builder.add_node("general_response_node", general_response_node)

# features/search_abstracts
graph_builder.add_node("transform_query_node_abstract", transform_query_node_abstract)
graph_builder.add_node("vector_search_abstracts_node", vector_search_abstracts_node)
graph_builder.add_node("relate_articles_to_query_node", relate_articles_to_query_node)
graph_builder.add_node("format_articles_metadata_node", format_articles_metadata_node)

# features/search_in_article
graph_builder.add_node("transform_query_node_chunks", transform_query_node_chunks)
graph_builder.add_node("vector_search_chunks_node", vector_search_chunks_node)
graph_builder.add_node("answer_question_based_on_chunks_node", answer_question_based_on_chunks_node)

# features/general_purpose
graph_builder.add_edge(START, "classifier")
graph_builder.add_edge("classifier", "router")
graph_builder.add_conditional_edges(
  "router",
  lambda state: state.get("next"),
  {
    "transform_query_node_abstract": "transform_query_node_abstract",
    "transform_query_node_chunks": "transform_query_node_chunks",
    "general_response_node": "general_response_node",
  },
)
graph_builder.add_edge("general_response_node", END)

# features/search_abstracts
graph_builder.add_edge("transform_query_node_abstract", "vector_search_abstracts_node")
graph_builder.add_edge("vector_search_abstracts_node", "relate_articles_to_query_node")
graph_builder.add_edge("relate_articles_to_query_node", "format_articles_metadata_node")
graph_builder.add_edge("format_articles_metadata_node", END)

# features/search_in_article
graph_builder.add_edge("transform_query_node_chunks", "vector_search_chunks_node")
graph_builder.add_edge("vector_search_chunks_node", "answer_question_based_on_chunks_node")
graph_builder.add_edge("answer_question_based_on_chunks_node", END)

# Complie graph into runnable object
graph = graph_builder.compile()


def run_chatbot():
  state = {"messages": [], "message_type": None}
  while True:
    user_input = input("Message: ")
    state["messages"] = state.get("messages", []) + [HumanMessage(content=user_input)]
    state = graph.invoke(state)  # type: ignore

    if state.get("messages") and len(state["messages"]) > 0:
      last_message = state["messages"][-1]
      print(f"Assistant: {last_message.content}")


if __name__ == "__main__":
  run_chatbot()
