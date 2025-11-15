from langchain_core.messages import HumanMessage
from graphs.workflow import graph


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
