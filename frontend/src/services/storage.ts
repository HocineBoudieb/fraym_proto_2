import { openDB } from 'idb';
import type { AuthData, ComponentTree } from '../types';

const DB_NAME = 'fraym-chat';
const DB_VERSION = 4;
const AUTH_STORE = 'auth';
const SESSION_STORE = 'sessions';

// Interface pour les données de session stockées
export interface SessionData {
  ip: string;
  sessionId: string;
  lastComponents: ComponentTree | null;
  lastUpdated: string;
}

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(AUTH_STORE)) {
        db.createObjectStore(AUTH_STORE);
      }
      
      // Recréer l'object store sessions pour corriger les problèmes de keyPath
      if (db.objectStoreNames.contains(SESSION_STORE)) {
        db.deleteObjectStore(SESSION_STORE);
      }
      db.createObjectStore(SESSION_STORE, { keyPath: 'ip' });
    },
  });
};

export const saveAuthData = async (data: AuthData): Promise<void> => {
  const db = await initDB();
  await db.put(AUTH_STORE, data, 'userData');
};

export const getAuthData = async (): Promise<AuthData | undefined> => {
  const db = await initDB();
  return db.get(AUTH_STORE, 'userData');
};

export const clearAuthData = async (): Promise<void> => {
  const db = await initDB();
  await db.delete(AUTH_STORE, 'userData');
};

export const updateCurrentSession = async (sessionId: string): Promise<void> => {
  const db = await initDB();
  const userData = await db.get(AUTH_STORE, 'userData') as AuthData | undefined;
  
  if (userData) {
    await db.put(AUTH_STORE, { ...userData, currentSessionId: sessionId }, 'userData');
  }
};

// Fonction pour obtenir l'IP du client (simulation côté frontend)
const getClientIP = async (): Promise<string> => {
  try {
    // En production, vous pourriez vouloir utiliser un service pour obtenir l'IP réelle
    // Pour l'instant, on utilise une combinaison d'identifiants du navigateur
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);
    const fingerprint = canvas.toDataURL();
    
    // Créer un hash simple basé sur le fingerprint et d'autres données
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const combined = `${fingerprint}-${userAgent}-${language}-${timezone}`;
    
    // Hash simple
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `client_${Math.abs(hash)}`;
  } catch (error) {
    // Fallback: utiliser localStorage pour créer un ID persistant
    let clientId = localStorage.getItem('fraym_client_id');
    if (!clientId) {
      clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('fraym_client_id', clientId);
    }
    return clientId;
  }
};

// Sauvegarder les données de session avec l'IP
export const saveSessionData = async (sessionId: string, components: ComponentTree | null): Promise<void> => {
  const db = await initDB();
  const ip = await getClientIP();
  
  // Validation de l'IP pour éviter les erreurs de keyPath
  if (!ip || typeof ip !== 'string' || ip.trim() === '') {
    console.error('Invalid IP value for session storage:', ip);
    throw new Error('Cannot save session data: invalid IP value');
  }
  
  const sessionData: SessionData = {
    ip: ip.trim(),
    sessionId,
    lastComponents: components,
    lastUpdated: new Date().toISOString()
  };
  
  // L'object store utilise keyPath: 'ip', donc pas besoin de clé explicite
  await db.put(SESSION_STORE, sessionData);
};

// Récupérer les données de session basées sur l'IP
export const getSessionDataByIP = async (): Promise<SessionData | undefined> => {
  const db = await initDB();
  const ip = await getClientIP();
  
  return db.get(SESSION_STORE, ip);
};

// Nettoyer les anciennes sessions (optionnel)
export const cleanOldSessions = async (maxAgeInDays: number = 30): Promise<void> => {
  const db = await initDB();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays);
  
  const tx = db.transaction(SESSION_STORE, 'readwrite');
  const store = tx.objectStore(SESSION_STORE);
  
  const allSessions = await store.getAll();
  
  for (const session of allSessions) {
    const sessionDate = new Date(session.lastUpdated);
    if (sessionDate < cutoffDate) {
      await store.delete(session.ip);
    }
  }
  
  await tx.done;
};

// Supprimer les données de session pour l'IP actuelle
export const clearCurrentSessionData = async (): Promise<void> => {
  const db = await initDB();
  const ip = await getClientIP();
  
  await db.delete(SESSION_STORE, ip);
};