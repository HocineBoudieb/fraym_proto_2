import { openDB } from 'idb';
import type { AuthData } from '../types';

const DB_NAME = 'fraym-chat';
const DB_VERSION = 2;
const AUTH_STORE = 'auth';

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(AUTH_STORE)) {
        db.createObjectStore(AUTH_STORE);
      }
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