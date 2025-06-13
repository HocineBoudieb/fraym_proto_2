/**
 * Configuration de l'application
 */

// URL de base de l'API selon l'environnement
export const API_BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL || 'https://your-ngrok-url.ngrok.io'
  : 'http://localhost:8000';

// Configuration de l'authentification
export const AUTH_CONFIG = {
  tokenKey: 'rasa_fraym_token',
  apiKeyKey: 'rasa_fraym_api_key',
  refreshThreshold: 5 * 60 * 1000, // 5 minutes avant expiration
};

// Configuration de l'application
export const APP_CONFIG = {
  name: 'Rasa Fraym',
  version: '1.0.0',
  description: 'Interface web pour l\'assistant OpenAI',
  maxMessageLength: 4000,
  maxHistoryLength: 100,
};

// Configuration du chat
export const CHAT_CONFIG = {
  autoSave: true,
  autoSaveInterval: 30000, // 30 secondes
  typingIndicatorDelay: 1000,
  maxRetries: 3,
  retryDelay: 1000,
};

// URLs des endpoints API
export const API_ENDPOINTS = {
  auth: {
    autoRegister: '/auth/auto-register',
    refresh: '/auth/refresh',
  },
  sessions: {
    list: '/sessions',
    create: '/sessions',
    get: (id: string) => `/sessions/${id}`,
    delete: (id: string) => `/sessions/${id}`,
  },
  messages: {
    list: (sessionId: string) => `/sessions/${sessionId}/messages`,
    create: (sessionId: string) => `/sessions/${sessionId}/messages`,
  },
  chat: {
    send: '/chat',
  },
  health: '/health',
};

// Configuration du développement
export const DEV_CONFIG = {
  enableDebugLogs: !import.meta.env.PROD,
  enableMockData: false,
  apiTimeout: 30000, // 30 secondes
};

// Helper pour construire les URLs complètes
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};

// Helper pour les logs de debug
export const debugLog = (...args: any[]): void => {
  if (DEV_CONFIG.enableDebugLogs) {
    console.log('[Rasa Fraym Debug]', ...args);
  }
};

// Configuration des thèmes
export const THEME_CONFIG = {
  default: 'light',
  available: ['light', 'dark', 'auto'],
  storageKey: 'rasa_fraym_theme',
};

// Configuration des notifications
export const NOTIFICATION_CONFIG = {
  duration: 5000, // 5 secondes
  position: 'top-right' as const,
  maxVisible: 3,
};

export default {
  API_BASE_URL,
  AUTH_CONFIG,
  APP_CONFIG,
  CHAT_CONFIG,
  API_ENDPOINTS,
  DEV_CONFIG,
  THEME_CONFIG,
  NOTIFICATION_CONFIG,
  buildApiUrl,
  debugLog,
};