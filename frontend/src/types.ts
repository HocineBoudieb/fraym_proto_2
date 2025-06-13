// Types pour l'API
export interface User {
  id: string;
  apiKey: string;
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
  type: ComponentType;
  props: ComponentProps;
}

export type ComponentTree = Component | Component[] | string;

// Types pour IndexedDB
export interface AuthData {
  apiKey: string;
  currentSessionId?: string;
  expiresAt?: string;
}