from openai import AsyncOpenAI
from typing import List, Dict, Any
from config import settings
from prisma import Prisma
import asyncio
import re
import json
from openai import AsyncOpenAI

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.assistant_id = settings.openai_assistant_id
    
    async def create_thread(self) -> str:
        """Crée un nouveau thread OpenAI"""
        thread = await self.client.beta.threads.create()
        return thread.id
    
    async def add_message_to_thread(self, thread_id: str, content: str, role: str = "user") -> str:
        """Ajoute un message à un thread"""
        message = await self.client.beta.threads.messages.create(
            thread_id=thread_id,
            role=role,
            content=content
        )
        return message.id
    
    async def run_assistant(self, thread_id: str, user_id: str = None) -> str:
        """Lance l'assistant sur un thread et attend la réponse"""
        run = await self.client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=self.assistant_id
        )
        
        # Attendre que le run soit terminé
        while run.status in ["queued", "in_progress", "cancelling"]:
            await asyncio.sleep(1)
            run = await self.client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id
            )
        
        if run.status == "completed":
            # Récupérer les messages du thread
            messages = await self.client.beta.threads.messages.list(
                thread_id=thread_id,
                order="desc",
                limit=1
            )
            
            if messages.data:
                latest_message = messages.data[0]
                if latest_message.role == "assistant":
                    # Extraire le contenu texte du message
                    content = ""
                    for content_block in latest_message.content:
                        if content_block.type == "text":
                            content += content_block.text.value
                    
                    # Traiter la réponse pour enlever les backticks et 'json'
                    processed_content = self._process_response(content)
                    
                    # Traiter le useState si présent et user_id fourni
                    suggestion = None
                    if user_id:
                        processed_content, cart_updated, suggestion = await self._handle_use_state(processed_content, user_id)
                    
                    return processed_content, latest_message.id, suggestion
            
            raise Exception("Aucune réponse de l'assistant trouvée")
        else:
            raise Exception(f"Erreur lors de l'exécution de l'assistant: {run.status}")
    
    async def get_thread_messages(self, thread_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Récupère les messages d'un thread"""
        messages = await self.client.beta.threads.messages.list(
            thread_id=thread_id,
            order="asc",
            limit=limit
        )
        
        formatted_messages = []
        for message in messages.data:
            content = ""
            for content_block in message.content:
                if content_block.type == "text":
                    content += content_block.text.value
            
            formatted_messages.append({
                "id": message.id,
                "role": message.role,
                "content": content,
                "created_at": message.created_at
            })
        
        return formatted_messages
    
    def _process_response(self, content: str) -> str:
        """Traite la réponse pour enlever les backticks et 'json' du début et s'assurer que le JSON est valide"""
        import json
        
        # Enlever les backticks de début et de fin avec 'json'
        # Pattern pour matcher ```json au début et ``` à la fin
        pattern = r'^```json\s*\n?(.*?)\n?```$'
        match = re.match(pattern, content.strip(), re.DOTALL | re.MULTILINE)
        
        if match:
            # Extraire le contenu sans les backticks et 'json'
            json_content = match.group(1).strip()
        else:
            # Essayer de détecter d'autres patterns de backticks
            # Pattern pour ```json sans fermeture ou avec variations
            patterns = [
                r'^```json\s*\n?(.*?)$',  # ```json sans fermeture
                r'^```\s*\n?(.*?)\n?```$',  # ``` sans json
                r'^```.*?\n(.*?)\n?```$',  # ```quelquechose
            ]
            
            json_content = content.strip()
            for pattern in patterns:
                match = re.match(pattern, json_content, re.DOTALL | re.MULTILINE)
                if match:
                    json_content = match.group(1).strip()
                    break
        
        # Nettoyer le contenu JSON
        json_content = self._clean_json_content(json_content)
        
        # Valider que le JSON est parsable
        try:
            json.loads(json_content)
            return json_content
        except json.JSONDecodeError as e:
            # Si le JSON n'est pas valide, essayer de le corriger
            corrected_json = self._fix_json_format(json_content)
            try:
                json.loads(corrected_json)
                return corrected_json
            except json.JSONDecodeError:
                # Si impossible à corriger, retourner le contenu original
                return content
    
    def _clean_json_content(self, content: str) -> str:
        """Nettoie le contenu JSON des caractères indésirables"""
        # Enlever les backticks restants
        content = re.sub(r'`+', '', content)
        
        # Enlever les marqueurs markdown restants
        content = re.sub(r'^(json|JSON)\s*\n?', '', content, flags=re.MULTILINE)
        
        # Enlever les espaces en début et fin
        content = content.strip()
        
        return content
    
    def _fix_json_format(self, content: str) -> str:
        """Essaie de corriger les erreurs communes de formatage JSON"""
        # Enlever les virgules en fin d'objet ou de tableau
        content = re.sub(r',\s*}', '}', content)
        content = re.sub(r',\s*]', ']', content)
        
        # Corriger les guillemets simples en guillemets doubles
        content = re.sub(r"'([^']*)':", r'"\1":', content)
        content = re.sub(r":\s*'([^']*)'", r': "\1"', content)
        
        # Enlever les commentaires
        content = re.sub(r'//.*?\n', '\n', content)
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        
        return content
    
    async def _handle_use_state(self, content: str, user_id: str) -> tuple[str, bool, str]:
        """Traite le useState dans la réponse et met à jour le cart si nécessaire"""
        cart_updated = False
        suggestion = None
        
        try:
            # Parser le JSON de la réponse
            response_data = json.loads(content)
            
            # Extraire la suggestion si présente
            if "suggestion" in response_data:
                suggestion = response_data["suggestion"]
            
            # Vérifier s'il y a un useState avec un cart
            if "useState" in response_data and "cart" in response_data["useState"]:
                cart_items = response_data["useState"]["cart"]
                
                # Mettre à jour le cart dans la base de données
                cart_updated = await self._update_user_cart(user_id, cart_items)
                
                # Supprimer le cart du useState et ajouter cart_updated
                del response_data["useState"]["cart"]
                response_data["cart_updated"] = cart_updated
                
                # Retourner le JSON modifié
                return json.dumps(response_data), cart_updated, suggestion
                
        except (json.JSONDecodeError, KeyError) as e:
            # Si le parsing échoue ou si les clés n'existent pas, on ignore silencieusement
            pass
        
        return content, cart_updated, suggestion
    
    async def _update_user_cart(self, user_id: str, cart_items: List[Dict[str, Any]]) -> bool:
        """Met à jour le cart de l'utilisateur dans la base de données avec synchronisation intelligente"""
        prisma = Prisma()
        await prisma.connect()
        cart_updated = False
        
        try:
            # Récupérer les items existants du cart
            existing_items = await prisma.cartitem.find_many(
                where={"userId": user_id}
            )
            
            # Créer des dictionnaires pour faciliter la comparaison
            existing_products = {item.productId: item for item in existing_items}
            received_products = {item.get("productId", ""): item for item in cart_items}
            
            # Supprimer les items qui ne sont plus dans le cart reçu
            items_to_delete = []
            for product_id, existing_item in existing_products.items():
                if product_id not in received_products:
                    items_to_delete.append(existing_item.id)
            
            if items_to_delete:
                await prisma.cartitem.delete_many(
                    where={"id": {"in": items_to_delete}}
                )
                cart_updated = True
            
            # Mettre à jour ou créer les items du cart reçu
            for item in cart_items:
                product_id = item.get("productId", "")
                
                item_data = {
                    "productName": item.get("productName", ""),
                    "quantity": item.get("quantity", 1),
                    "unitPrice": float(item.get("unitPrice", 0)),
                    "totalPrice": float(item.get("totalPrice", 0))
                }
                
                if product_id in existing_products:
                    # Mettre à jour l'item existant
                    existing_item = existing_products[product_id]
                    # Vérifier si une mise à jour est nécessaire
                    needs_update = (
                        existing_item.productName != item_data["productName"] or
                        existing_item.quantity != item_data["quantity"] or
                        existing_item.unitPrice != item_data["unitPrice"] or
                        existing_item.totalPrice != item_data["totalPrice"]
                    )
                    
                    if needs_update:
                        await prisma.cartitem.update(
                            where={"id": existing_item.id},
                            data=item_data
                        )
                        cart_updated = True
                else:
                    # Créer un nouvel item
                    await prisma.cartitem.create(
                        data={
                            "userId": user_id,
                            "productId": product_id,
                            **item_data
                        }
                    )
                    cart_updated = True
                
        except Exception as e:
            print(f"Erreur lors de la mise à jour du cart: {e}")
        finally:
            await prisma.disconnect()
        
        return cart_updated

# Instance globale du service
openai_service = OpenAIService()