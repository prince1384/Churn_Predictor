from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.chatbot_service import get_gemini_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_gemini(request: ChatRequest):
    try:
        response = await get_gemini_response(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
