import { API_BASE_URL } from '../config';
import type { Session, Message, ChatResponse, Cart } from '../types';

const API_URL = API_BASE_URL;

export const autoRegister = async (): Promise<{ apiKey: string; expiresAt: string }> => {
  const response = await fetch(`${API_URL}/auth/auto-register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'enregistrement automatique: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    apiKey: data.api_key,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
  };
};

export const createSession = async (apiKey: string): Promise<Session> => {
  const response = await fetch(`${API_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      title: 'Nouvelle conversation'
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la création de la session: ${response.statusText}`);
  }

  return response.json();
};

export const sendMessage = async (sessionId: string, apiKey: string, content: string): Promise<ChatResponse> => {
  const response = await fetch(`${API_URL}/sessions/${sessionId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      content
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'envoi du message: ${response.statusText}`);
  }

  return response.json();
};

export const getMessages = async (sessionId: string, apiKey: string): Promise<Message[]> => {
  const response = await fetch(`${API_URL}/sessions/${sessionId}/messages`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des messages: ${response.statusText}`);
  }

  return response.json();
};

export const getCart = async (apiKey: string): Promise<Cart> => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du cart: ${response.statusText}`);
  }

  const rawData = await response.json();
  console.log('🛒 Données brutes du serveur:', rawData);
  
  // Transformer les données du serveur (snake_case) vers le format frontend (camelCase)
  const items = Array.isArray(rawData) ? rawData : (rawData.items || []);
  
  const transformedData: Cart = {
    items: items.map((item: any) => {
      console.log('🛒 Item brut avant transformation:', item);
      const transformedItem = {
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price
      };
      console.log('🛒 Item transformé:', transformedItem);
      return transformedItem;
    }),
    totalItems: rawData.total_items || items.length || 0,
    totalPrice: rawData.total_amount || items.reduce((sum: number, item: any) => sum + (item.total_price || 0), 0) || 0
  };
  
  console.log('🛒 Données transformées:', transformedData);
  return transformedData;
};