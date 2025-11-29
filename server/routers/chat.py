from fastapi import APIRouter, HTTPException
from sqlmodel import select  # whole of sql model still runs on psycopg2
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from ..core.database import SessionDep
from ..core.auth_dependencies import CurrentUser
from ..models.message import Message, MessageRole
from ..models.user_conversation import UserConversation
from ..schemas.message import MessageCreate, MessageRead
from ..graphs.workflow import graph
from ..core.llm import llm_helper
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from psycopg_pool import AsyncConnectionPool  # this requires psycopg[binary] (v3)
from psycopg.rows import dict_row
from core.config_loader import settings
from ..schemas.user_conversation import UserConversationRead

POSTGRES_URI = settings.SUPABASE_URI
# Chat router definition
router = APIRouter(prefix="/chat", tags=["Chat"])


@router.get("/conversations", response_model=list[UserConversationRead])
async def get_conversations(
  session: SessionDep,
  current_user: CurrentUser,
):
  """
  Fetch all conversations for the current user.
  """
  statement = (
    select(UserConversation)
    .where(UserConversation.user_id == current_user.id)
    .order_by(UserConversation.updated_at.desc())
  )
  conversations = session.exec(statement).all()
  return conversations


@router.get("/conversations/{conversation_id}", response_model=list[MessageRead])
async def get_conversation_messages(
  conversation_id: int,
  session: SessionDep,
  current_user: CurrentUser,
):
  """
  Fetch all messages for a specific conversation.
  """
  # Verify conversation exists and belongs to user
  conversation = session.get(UserConversation, conversation_id)
  if not conversation:
    raise HTTPException(status_code=404, detail="Conversation not found")
  if conversation.user_id != current_user.id:
    raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

  statement = (
    select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
  )
  messages = session.exec(statement).all()
  return messages


@router.post("/message", response_model=MessageRead)
async def chat(
  message_in: MessageCreate,
  session: SessionDep,
  current_user: CurrentUser,
):
  """
  Send a message to the AI and get a response.
  If conversation_id is not provided, a new conversation is created.
  """
  conversation_id = message_in.conversation_id

  # If its first message (no conversation_id info), create new conversation
  if not conversation_id:
    # llm generated title
    title = get_conversation_title(message_in.content)
    new_conversation = UserConversation(user_id=current_user.id, title=title, state={})
    session.add(new_conversation)
    session.commit()
    session.refresh(new_conversation)
    conversation_id = new_conversation.id
    conversation = new_conversation
  else:
    # Verify conversation exists and belongs to user
    conversation = session.get(UserConversation, conversation_id)
    if not conversation:
      raise HTTPException(status_code=404, detail="Conversation not found")
    if conversation.user_id != current_user.id:
      raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

  # 2. Load conversation history
  statement = (
    select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
  )
  db_messages = session.exec(statement).all()

  # 3. Convert to LangChain messages
  langchain_messages = []
  for msg in db_messages:
    if msg.role == MessageRole.USER:
      langchain_messages.append(HumanMessage(content=msg.content))
    elif msg.role == MessageRole.ASSISTANT:
      langchain_messages.append(AIMessage(content=msg.content))
    elif msg.role == MessageRole.SYSTEM:
      langchain_messages.append(SystemMessage(content=msg.content))

  # 4. Add the new user message to the history for the graph
  langchain_messages.append(HumanMessage(content=message_in.content))

  # 5. Invoke the graph
  try:
    # Load existing state
    current_state = conversation.state or {}
    # Merge with messages
    graph_input = {**current_state, "messages": langchain_messages}

    state = graph.invoke(graph_input)
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")

  # 6. Extract the AI response
  if not state.get("messages"):
    raise HTTPException(status_code=500, detail="No response from AI")

  last_message = state["messages"][-1]
  ai_content = last_message.content

  # 7. Save messages to DB
  # Save user message
  user_msg = Message(
    conversation_id=conversation_id,
    role=MessageRole.USER,
    content=message_in.content,
  )
  session.add(user_msg)

  # Save AI message
  ai_msg = Message(
    conversation_id=conversation_id,
    role=MessageRole.ASSISTANT,
    content=ai_content,
  )
  session.add(ai_msg)

  # 8. Save state to DB (excluding messages)
  state_to_save = state.copy()
  if "messages" in state_to_save:
    del state_to_save["messages"]

  conversation.state = state_to_save
  session.add(conversation)

  session.commit()
  session.refresh(ai_msg)

  return ai_msg


def get_conversation_title(text: str) -> str:
  system_prompt = SystemMessage(
    content="""
    You are responsible for generating concise and descriptive titles for user conversations based on their initial message.
    Try to infer a good title for conversation from the message content.
    Title should be brief, ideally under 6 words.

    Generate title and title only.
    """
  )
  response = llm_helper.invoke([system_prompt] + [HumanMessage(content=text)])
  return str(response.content)
