from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Auth Models
class UserCreate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]
    created_at: datetime

class ApiKeyResponse(BaseModel):
    api_key: str
    user: UserResponse

# Session Models
class SessionCreate(BaseModel):
    title: Optional[str] = None

class SessionResponse(BaseModel):
    id: str
    title: Optional[str]
    openai_thread_id: str
    created_at: datetime
    updated_at: datetime

# Message Models
class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime

class ChatResponse(BaseModel):
    message: MessageResponse
    assistant_response: MessageResponse

# Error Models
class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

# Health Check
class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime