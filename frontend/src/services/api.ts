import type { Session, Message, ChatResponse } from '../types';
import { API_BASE_URL } from '../config';

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