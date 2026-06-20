from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from .. import auth, models
from ..ai import chatbot_engine

router = APIRouter(prefix="/chats", tags=["AI Career Mentor"])

class ChatMessage(BaseModel):
    message: str
    history: List[Dict[str, str]] = []  # list of {"role": "user"|"assistant", "content": str}

@router.post("/message")
def chat_with_mentor(payload: ChatMessage, current_user: models.User = Depends(auth.get_current_user)):
    """
    Exposes RAG chatbot capabilities to guide students interactively.
    """
    response_text = chatbot_engine.generate_mentor_response(
        query=payload.message,
        chat_history=payload.history
    )
    return {
        "reply": response_text
    }
