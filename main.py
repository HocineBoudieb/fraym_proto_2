from fastapi import FastAPI, HTTPException, Depends, status, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional, List
import uvicorn
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

from config import settings
from models import (
    UserCreate, UserResponse, ApiKeyResponse, SessionCreate, SessionResponse,
    MessageCreate, MessageResponse, ChatResponse, ErrorResponse, HealthResponse,
    CartItemCreate, CartItemResponse, CartResponse, CartUpdateRequest
)
from auth import generate_api_key, create_access_token, get_current_user, verify_api_key
from openai_service import openai_service
from prisma import Prisma

app = FastAPI(
    title="Rasa Fraym API Proxy",
    description="API Proxy entre l'application web et OpenAI Assistant API",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À configurer selon vos besoins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation de la base de données
@app.on_event("startup")
async def startup():
    prisma = Prisma()
    await prisma.connect()
    print("Base de données connectée")

@app.on_event("shutdown")
async def shutdown():
    prisma = Prisma()
    await prisma.disconnect()
    print("Base de données déconnectée")

# Routes d'authentification
@app.post("/auth/auto-register", response_model=ApiKeyResponse)
async def auto_register_user(request: Request):
    """Enregistrement automatique basé sur l'adresse IP"""
    client_ip = request.client.host
    
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Vérifier si un utilisateur existe déjà pour cette IP
        existing_user = await prisma.user.find_first(
            where={"email": f"auto_{client_ip}@fraym.local"}
        )
        
        if existing_user:
            # Retourner la clé API existante
            return ApiKeyResponse(
                api_key=existing_user.apiKey,
                user=UserResponse(
                    id=existing_user.id,
                    name=existing_user.name,
                    email=existing_user.email,
                    created_at=existing_user.createdAt
                )
            )
        
        # Créer un nouvel utilisateur automatique
        api_key = generate_api_key()
        user = await prisma.user.create(
            data={
                "name": f"Auto User {client_ip}",
                "email": f"auto_{client_ip}@fraym.local",
                "apiKey": api_key
            }
        )
        
        return ApiKeyResponse(
            api_key=api_key,
            user=UserResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                created_at=user.createdAt
            )
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'enregistrement automatique: {str(e)}")
    finally:
        await prisma.disconnect()

@app.post("/auth/register", response_model=ApiKeyResponse)
async def register_user(user_data: UserCreate):
    """Enregistre un nouvel utilisateur et génère une clé API"""
    prisma = Prisma()
    await prisma.connect()
    try:
        api_key = generate_api_key()
        user = await prisma.user.create(
            data={
                "apiKey": api_key,
                "name": user_data.name,
                "email": user_data.email
            }
        )
        return ApiKeyResponse(
            api_key=api_key,
            user=UserResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                created_at=user.createdAt
            )
        )
    finally:
        await prisma.disconnect()

@app.post("/auth/login")
async def login(api_key: str = Header(..., alias="X-API-Key")):
    """Authentifie un utilisateur avec sa clé API et retourne un token JWT"""
    user = await verify_api_key(api_key)
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Routes de gestion des sessions
@app.post("/sessions", response_model=SessionResponse)
async def create_session(
    session_data: SessionCreate,
    api_key: str = Header(..., alias="Authorization")
):
    """Crée une nouvelle session de chat"""
    # Extraire la clé API du header Authorization (format: "Bearer <api_key>")
    if not api_key.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Format d'autorisation invalide")
    
    actual_api_key = api_key.replace("Bearer ", "")
    current_user = await verify_api_key(actual_api_key)
    
    # Créer un thread OpenAI
    thread_id = await openai_service.create_thread()
    
    prisma = Prisma()
    await prisma.connect()
    try:
        session = await prisma.session.create(
            data={
                "userId": current_user.id,
                "openaiThreadId": thread_id,
                "openaiAssistantId": settings.openai_assistant_id,
                "title": session_data.title or f"Session {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            }
        )
        return SessionResponse(
            id=session.id,
            title=session.title,
            openai_thread_id=session.openaiThreadId,
            created_at=session.createdAt,
            updated_at=session.updatedAt
        )
    finally:
        await prisma.disconnect()

@app.get("/sessions", response_model=List[SessionResponse])
async def get_user_sessions(current_user = Depends(get_current_user)):
    """Récupère toutes les sessions de l'utilisateur"""
    prisma = Prisma()
    await prisma.connect()
    try:
        sessions = await prisma.session.find_many(
            where={"userId": current_user.id},
            order={"updatedAt": "desc"}
        )
        return [
            SessionResponse(
                id=session.id,
                title=session.title,
                openai_thread_id=session.openaiThreadId,
                created_at=session.createdAt,
                updated_at=session.updatedAt
            )
            for session in sessions
        ]
    finally:
        await prisma.disconnect()

@app.get("/sessions/{session_id}/messages", response_model=List[MessageResponse])
async def get_session_messages(
    session_id: str,
    api_key: str = Header(..., alias="Authorization")
):
    """Récupère les messages d'une session"""
    # Extraire la clé API du header Authorization (format: "Bearer <api_key>")
    if not api_key.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Format d'autorisation invalide")
    
    actual_api_key = api_key.replace("Bearer ", "")
    current_user = await verify_api_key(actual_api_key)
    
    prisma = Prisma()
    await prisma.connect()
    try:
        session = await prisma.session.find_first(
            where={"id": session_id, "userId": current_user.id}
        )
        if not session:
            raise HTTPException(status_code=404, detail="Session non trouvée")
        
        messages = await prisma.message.find_many(
            where={"sessionId": session_id},
            order={"createdAt": "asc"}
        )
        
        return [
            MessageResponse(
                id=message.id,
                role=message.role,
                content=message.content,
                created_at=message.createdAt
            )
            for message in messages
        ]
    finally:
        await prisma.disconnect()

# Route principale de chat
@app.post("/sessions/{session_id}/chat", response_model=ChatResponse)
async def chat(
    session_id: str,
    message_data: MessageCreate,
    api_key: str = Header(..., alias="Authorization")
):
    """Envoie un message à OpenAI et retourne la réponse"""
    # Extraire la clé API du header Authorization (format: "Bearer <api_key>")
    if not api_key.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Format d'autorisation invalide")
    
    actual_api_key = api_key.replace("Bearer ", "")
    current_user = await verify_api_key(actual_api_key)
    
    prisma = Prisma()
    await prisma.connect()
    try:
        # Vérifier que la session appartient à l'utilisateur
        session = await prisma.session.find_first(
            where={"id": session_id, "userId": current_user.id}
        )
        if not session:
            raise HTTPException(status_code=404, detail="Session non trouvée")
        
        # Sauvegarder le message utilisateur
        user_message = await prisma.message.create(
            data={
                "sessionId": session_id,
                "role": "user",
                "content": message_data.content
            }
        )
        
        # Envoyer le message à OpenAI
        openai_message_id = await openai_service.add_message_to_thread(
            session.openaiThreadId,
            message_data.content
        )
        
        # Mettre à jour le message avec l'ID OpenAI
        await prisma.message.update(
            where={"id": user_message.id},
            data={"openaiMessageId": openai_message_id}
        )
        
        # Exécuter l'assistant et récupérer la réponse
        assistant_response, assistant_message_id, suggestion = await openai_service.run_assistant(
            session.openaiThreadId,
            current_user.id
        )
        
        # Sauvegarder la réponse de l'assistant
        assistant_message = await prisma.message.create(
            data={
                "sessionId": session_id,
                "role": "assistant",
                "content": assistant_response,
                "openaiMessageId": assistant_message_id
            }
        )
        
        # Mettre à jour la session
        await prisma.session.update(
            where={"id": session_id},
            data={"updatedAt": datetime.now()}
        )
        
        return ChatResponse(
            message=MessageResponse(
                id=user_message.id,
                role=user_message.role,
                content=user_message.content,
                created_at=user_message.createdAt
            ),
            assistant_response=MessageResponse(
                id=assistant_message.id,
                role=assistant_message.role,
                content=assistant_message.content,
                created_at=assistant_message.createdAt
            ),
            suggestion=suggestion
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du chat: {str(e)}")
    finally:
        await prisma.disconnect()

# Routes de gestion du cart
@app.get("/cart", response_model=CartResponse)
async def get_user_cart(
    api_key: str = Header(..., alias="Authorization")
):
    """Récupère le cart de l'utilisateur"""
    # Extraire la clé API du header Authorization
    if not api_key.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Format d'autorisation invalide")
    
    actual_api_key = api_key.replace("Bearer ", "")
    current_user = await verify_api_key(actual_api_key)
    
    prisma = Prisma()
    await prisma.connect()
    try:
        cart_items = await prisma.cartitem.find_many(
            where={"userId": current_user.id},
            order={"createdAt": "asc"}
        )
        
        # Calculer les totaux
        total_amount = sum(item.totalPrice for item in cart_items)
        total_items = sum(item.quantity for item in cart_items)
        
        return CartResponse(
            items=[
                CartItemResponse(
                    id=item.id,
                    product_id=item.productId,
                    product_name=item.productName,
                    quantity=item.quantity,
                    unit_price=item.unitPrice,
                    total_price=item.totalPrice,
                    created_at=item.createdAt,
                    updated_at=item.updatedAt
                )
                for item in cart_items
            ],
            total_amount=total_amount,
            total_items=total_items
        )
    finally:
        await prisma.disconnect()

@app.put("/cart", response_model=CartResponse)
async def update_user_cart(
    cart_data: CartUpdateRequest,
    api_key: str = Header(..., alias="Authorization")
):
    """Met à jour le cart de l'utilisateur"""
    # Extraire la clé API du header Authorization
    if not api_key.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Format d'autorisation invalide")
    
    actual_api_key = api_key.replace("Bearer ", "")
    current_user = await verify_api_key(actual_api_key)
    
    prisma = Prisma()
    await prisma.connect()
    try:
        # Supprimer tous les items existants du cart
        await prisma.cartitem.delete_many(
            where={"userId": current_user.id}
        )
        
        # Ajouter les nouveaux items
        created_items = []
        for item in cart_data.cart:
            created_item = await prisma.cartitem.create(
                data={
                    "userId": current_user.id,
                    "productId": item.product_id,
                    "productName": item.product_name,
                    "quantity": item.quantity,
                    "unitPrice": item.unit_price,
                    "totalPrice": item.total_price
                }
            )
            created_items.append(created_item)
        
        # Calculer les totaux
        total_amount = sum(item.total_price for item in cart_data.cart)
        total_items = sum(item.quantity for item in cart_data.cart)
        
        return CartResponse(
            items=[
                CartItemResponse(
                    id=item.id,
                    product_id=item.productId,
                    product_name=item.productName,
                    quantity=item.quantity,
                    unit_price=item.unitPrice,
                    total_price=item.totalPrice,
                    created_at=item.createdAt,
                    updated_at=item.updatedAt
                )
                for item in created_items
            ],
            total_amount=total_amount,
            total_items=total_items
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour du cart: {str(e)}")
    finally:
        await prisma.disconnect()

# Routes utilitaires
@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API Proxy Rasa Fraym!", "version": "1.0.0"}

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="rasa-fraym-proxy",
        timestamp=datetime.now()
    )

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=settings.api_host,
        port=settings.api_port,
        reload=True
    )
