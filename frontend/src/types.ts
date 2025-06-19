// Types pour l'API
export interface User {
  id: string;
  apiKey: string;
}

// Profil utilisateur détaillé
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  created_at: string;
}

export interface Session {
  id: string;
  title: string;
  openai_thread_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatResponse {
  message: Message;
  assistant_response: Message;
  components?: ComponentTree;
  suggestion?: string;
}

// Types pour les composants
export type ComponentType = 
  | 'Button' | 'Card' | 'Text' | 'Heading' | 'Image' | 'Input'
  | 'Container' | 'Grid' | 'Flex'
  | 'ProductCard' | 'Hero' | 'Navigation'
  | 'ZaraHeader' | 'ZaraWelcome' | 'ZaraCategoryButtons' | 'ZaraProductGrid' | 'ZaraProductCard' | 'ZaraMessageInput' | 'ZaraContainer'
  | 'Header' | 'Footer' | 'Sidebar' | 'Welcome';

export interface ComponentProps {
  children?: ComponentTree | string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface Component {
  type?: ComponentType;
  component?: ComponentType;
  props?: ComponentProps;
  components?: Component[];
  id?: string;
  children?: ComponentTree | string;
  [key: string]: any;
}

export type ComponentTree = Component | Component[] | string;

// Types pour IndexedDB
export interface AuthData {
  apiKey: string;
  currentSessionId?: string;
  expiresAt?: string;
}

// Types pour le cart
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}