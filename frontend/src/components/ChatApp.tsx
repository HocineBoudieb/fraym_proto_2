import React, { useState, useEffect } from 'react';
import type { ChatResponse, ComponentTree, Cart as CartType } from '../types';
import { createSession, sendMessage, autoRegister, getCart } from '../services/api';
import { saveAuthData, getAuthData } from '../services/storage';
import { Container } from './Container';
import { Card } from './Card';
import { Text } from './Text';
import { Button } from './Button';
import { Input } from './Input';
import { Heading } from './Heading';
import { Image } from './Image';
import { Grid } from './Grid';
import { Flex } from './Flex';
import { ProductCard } from './ProductCard';
import { Hero } from './Hero';
import { Navigation } from './Navigation';
import { ZaraHeader } from './ZaraHeader';
import { ZaraWelcome } from './ZaraWelcome';
import { ZaraCategoryButtons } from './ZaraCategoryButtons';
import { ZaraProductGrid } from './ZaraProductGrid';
import { ZaraProductCard } from './ZaraProductCard';
import { ZaraMessageInput } from './ZaraMessageInput';
import { ZaraContainer } from './ZaraContainer';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { Welcome } from './Welcome';
import { Cart } from './Cart';
import { CartIcon } from './CartIcon';

interface ChatAppProps {
  className?: string;
}

// Fonction pour filtrer les props valides pour les composants React
const filterValidProps = (props: any) => {
  const validProps = { ...props };
  
  // Supprimer les props qui ne sont pas des attributs HTML valides
  delete validProps.children;
  delete validProps.text; // L'attribut text est géré séparément dans renderChildren
  delete validProps.items; // Les items du Grid sont gérés séparément
  delete validProps.columns; // Les colonnes du Grid sont converties en cols
  
  return validProps;
};

// Fonction pour normaliser les props
const normalizeProps = (props: any) => {
  return { ...props };
};

// Interface pour ComponentFactory
interface ComponentFactoryProps {
  componentData: ComponentTree;
}

// Mapping des composants disponibles
const componentMap: Record<string, React.ComponentType<any>> = {
  Button,
  Card,
  Text,
  Heading,
  Image,
  Input,
  Container,
  Grid,
  Flex,
  ProductCard,
  Hero,
  Navigation,
  ZaraHeader,
  ZaraWelcome,
  ZaraCategoryButtons,
  ZaraProductGrid,
  ZaraProductCard,
  ZaraMessageInput,
  ZaraContainer,
  Header,
  Footer,
  Sidebar,
  Welcome
};

// ComponentFactory pour rendre les composants dynamiquement
function ComponentFactory({ componentData }: ComponentFactoryProps) {
  console.log('🏭 ComponentFactory appelé avec:', componentData);
  
  // Si c'est une chaîne, la retourner directement
  if (typeof componentData === 'string') {
    console.log('📝 Rendu de texte:', componentData);
    return componentData;
  }
  
  // Si c'est un tableau, rendre chaque élément
  if (Array.isArray(componentData)) {
    console.log('📋 Rendu de tableau avec', componentData.length, 'éléments');
    return (
      <div className="space-y-4">
        {componentData.map((component, index) => (
          <ComponentFactory 
            key={index} 
            componentData={component} 
          />
        ))}
      </div>
    );
  }
  
  // Gérer le cas où les données ont une structure avec template et components
  if (componentData.template && componentData.components) {
    console.log('🎨 Structure template détectée, rendu des composants:', componentData.components);
    return (
      <div className="space-y-4">
        {componentData.components.map((component: any, index: number) => (
          <ComponentFactory 
            key={index} 
            componentData={component} 
          />
        ))}
      </div>
    );
  }
  
  // Gérer les deux formats possibles: 'type' ou 'component'
  const type = componentData.type || componentData.component;
  const props = componentData.props || {};
  console.log('🔧 Rendu du composant:', type, 'avec props:', props);
  
  // Récupérer le composant depuis le mapping
  const Component = componentMap[type as keyof typeof componentMap];
  
  if (!Component) {
    console.warn(`❌ Component type "${type}" not found. Available types:`, Object.keys(componentMap));
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <Text color="yellow-800">Composant "{type}" non trouvé</Text>
      </div>
    );
  }
  
  console.log('✅ Composant trouvé:', Component.name || type);
  const normalizedProps = normalizeProps(props);
  
  // Gestion spéciale pour le composant Grid avec des items
  if (type === 'Grid' && props.items && Array.isArray(props.items)) {
    console.log('🔲 Rendu spécial Grid avec items:', props.items);
    const { items, columns, ...gridProps } = props;
    
    return (
      <Component cols={columns || 3} {...filterValidProps(gridProps)}>
        {items.map((item: any, index: number) => (
          <ComponentFactory 
            key={index} 
            componentData={item} 
          />
        ))}
      </Component>
    );
  }
  
  // Rendre les enfants s'ils existent
  const renderChildren = () => {
    // Si il y a un attribut 'text', l'utiliser comme contenu
    if (props.text) {
      console.log('📝 Utilisation de l\'attribut text:', props.text);
      return props.text;
    }
    
    if (!props.children) return null;
    
    if (typeof props.children === 'string') {
      console.log('👶 Enfant texte:', props.children);
      return props.children;
    }
    
    if (Array.isArray(props.children)) {
      console.log('👶 Enfants tableau:', props.children.length, 'éléments');
      return props.children.map((child, index) => (
        <ComponentFactory 
          key={child.id || `child-${index}`} 
          componentData={child} 
        />
      ));
    }
    
    console.log('👶 Enfant objet:', props.children);
    return (
      <ComponentFactory componentData={props.children} />
    );
  };
  
  console.log('🎯 Rendu final du composant:', type);
  return (
    <Component {...filterValidProps(normalizedProps)}>
      {renderChildren()}
    </Component>
  );
}

export const ChatApp: React.FC<ChatAppProps> = ({ className = '' }) => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [renderedComponents, setRenderedComponents] = useState<ComponentTree | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentApiKey, setCurrentApiKey] = useState<string | null>(null);
  const [cart, setCart] = useState<CartType>({ items: [], totalItems: 0, totalPrice: 0 });
  const [showCart, setShowCart] = useState(false);

  // Charger les données d'authentification au démarrage
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        let authData = await getAuthData();
        
        // Vérifier si les données existent et ne sont pas expirées
        const isExpired = authData?.expiresAt && new Date(authData.expiresAt) < new Date();
        
        if (!authData?.apiKey || isExpired) {
          // Enregistrement automatique
          console.log('Enregistrement automatique en cours...');
          const autoAuthData = await autoRegister();
          
          authData = {
            apiKey: autoAuthData.apiKey,
            expiresAt: autoAuthData.expiresAt
          };
          
          await saveAuthData(authData);
          console.log('Enregistrement automatique réussi');
        }
        
        setCurrentApiKey(authData.apiKey);
        setIsConnected(true);
        
        // Créer une nouvelle session si nécessaire
        if (!authData.currentSessionId) {
          await createNewSession(authData.apiKey);
        } else {
          setCurrentSessionId(authData.currentSessionId);
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'authentification:', error);
        setError('Erreur lors de l\'initialisation. Veuillez recharger la page.');
      }
    };

    loadAuthData();
  }, []);
  
  // Fonction pour récupérer le cart
  const fetchCart = async () => {
    if (!currentApiKey) {
      console.log('🛒 Pas d\'API key pour récupérer le cart');
      return;
    }
    
    console.log('🛒 Début de l\'appel API pour récupérer le cart avec API key:', currentApiKey);
    
    try {
      const cartData = await getCart(currentApiKey);
      console.log('🛒 Données brutes reçues du serveur:', JSON.stringify(cartData, null, 2));
      console.log('🛒 Type de cartData:', typeof cartData);
      console.log('🛒 cartData.items:', cartData?.items);
      console.log('🛒 Nombre d\'items:', cartData?.items?.length);
      
      if (cartData?.items) {
        cartData.items.forEach((item, index) => {
          console.log(`🛒 Item ${index}:`, {
            id: item.id,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            unitPriceType: typeof item.unitPrice,
            totalPriceType: typeof item.totalPrice
          });
        });
      }
      
      setCart(cartData);
      console.log('🛒 Cart mis à jour dans le state');
    } catch (error) {
      console.error('🛒 Erreur lors de la récupération du cart:', error);
      console.error('🛒 Stack trace:', error.stack);
    }
  };

  // Fonction pour créer une nouvelle session
  const createNewSession = async (apiKey: string) => {
    try {
      const session = await createSession(apiKey);
      setCurrentSessionId(session.id);
      
      // Mettre à jour les données d'authentification avec la session
      const authData = await getAuthData();
      if (authData) {
        authData.currentSessionId = session.id;
        await saveAuthData(authData);
      }
      
    } catch (error) {
      console.error('Erreur lors de la création de session:', error);
      setError('Erreur lors de la création de session.');
    }
  };

  // Fonction pour démarrer une nouvelle session
  const handleNewSession = async () => {
    if (!currentApiKey) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Réinitialiser l'état de l'interface
      setRenderedComponents(null);
      setInputMessage('');
      
      // Créer une nouvelle session
      await createNewSession(currentApiKey);
      
    } catch (error) {
      console.error('Erreur lors de la création d\'une nouvelle session:', error);
      setError('Erreur lors de la création d\'une nouvelle session.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cette section contenait auparavant la fonction handleConnect qui a été remplacée par l'authentification automatique

  // Envoi de message
  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim();
    if (!content || !currentSessionId || !currentApiKey) return;

    setIsLoading(true);
    setError(null);
    
    // Effacer les composants précédents
    setRenderedComponents(null);

    try {
      if (!messageContent) {
        setInputMessage('');
      }

      // Envoyer le message à l'API
      const response: ChatResponse = await sendMessage(currentSessionId, currentApiKey, content);
      
      console.log('🔍 Réponse API reçue:', response);
      console.log('🎨 Composants dans la réponse:', response.components);
      
      // Vérifier si les composants sont dans response.components directement
      let componentsToRender = response.components;
      let cartUpdated = false;
      
      // Si pas de composants directs, vérifier si c'est dans une structure avec template
      if (!componentsToRender && response.assistant_response?.content) {
        try {
          const parsedContent = JSON.parse(response.assistant_response.content);
          console.log('📋 Contenu parsé:', parsedContent);
          
          // Vérifier si le cart a été mis à jour
          if (parsedContent.cart_updated === true) {
            cartUpdated = true;
            console.log('🛒 Cart mis à jour détecté!');
          }
          
          if (parsedContent.components) {
            componentsToRender = parsedContent.components;
            console.log('🔄 Composants trouvés dans le contenu parsé:', componentsToRender);
          }
        } catch (e) {
          console.log('⚠️ Impossible de parser le contenu comme JSON:', e);
        }
      }
      
      // Récupérer le cart si il a été mis à jour
      if (cartUpdated) {
        await fetchCart();
      }
      
      // Mettre à jour les composants si fournis
      if (componentsToRender) {
        console.log('✅ Mise à jour des composants avec:', componentsToRender);
        setRenderedComponents(componentsToRender);
        console.log('🚀 État renderedComponents mis à jour');
      } else {
        console.log('❌ Aucun composant trouvé dans la réponse');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setError('Erreur lors de l\'envoi du message.');
    } finally {
      setIsLoading(false);
    }
  };

  // Interface de chargement pendant l'authentification automatique
  if (!isConnected) {
    return (
      <div className="flex flex-col h-screen">
        {/* Header avec logo centré */}
        <div className="py-4">
          <div className="flex justify-center">
            <img 
              src="/fraym_demo_logo.png" 
              alt="Logo de la boutique" 
              className="h-28 w-auto"
            />
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <Container maxWidth="md" className="py-16">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 text-center shadow-2xl">
              <Text size="2xl" weight="bold" className="mb-4 text-gray-800">
                Initialisation...
              </Text>
              <Text color="gray-700" className="mb-6">
                Connexion automatique en cours, veuillez patienter.
              </Text>
              {error && (
                <div className="mt-4 backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-xl px-4 py-3">
                  <Text color="red-700" size="sm">
                    {error}
                  </Text>
                </div>
              )}
              <div className="mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  // Interface de rendu des composants
  return (
    <div className={`flex flex-col h-screen ${className}`}>
      {/* Header avec logo centré */}
        <div className="py-4">
          <div className="flex justify-center">
            <img 
              src="/fraym_demo_logo.png" 
              alt="Logo de la boutique" 
              className="h-30 w-auto"
            />
          </div>
        </div>
      
      {/* Zone de contenu dynamique - Rendu des composants */}
      <div className="flex-1 overflow-y-auto pb-32">
        {isLoading ? (
          <div className="fixed inset-0 backdrop-blur-xl bg-white/30 z-50 flex flex-col justify-center items-center">
            <div className="mb-8">
              <Text size="2xl" weight="bold" className="text-gray-800 mb-2">
                Web page generation
              </Text>
              <Text size="lg" className="text-gray-600">
                Generating content...
              </Text>
            </div>
            
            {/* Animation avec des divs grises qui apparaissent progressivement */}
            <div className="w-full max-w-2xl px-8 space-y-4">
              {/* Première ligne - longue */}
              <div className="h-6 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
              
              {/* Deuxième ligne - moyenne */}
              <div className="h-6 bg-gray-300 rounded-full animate-pulse w-3/4" style={{animationDelay: '0.3s'}}></div>
              
              {/* Troisième ligne - longue */}
              <div className="h-6 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              
              {/* Quatrième ligne - courte */}
              <div className="h-6 bg-gray-300 rounded-full animate-pulse w-1/2" style={{animationDelay: '0.9s'}}></div>
              
              {/* Liste avec puces */}
              <div className="space-y-3 mt-8">
                <div className="flex items-center space-x-3" style={{animationDelay: '1.2s'}}>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded-full animate-pulse flex-1"></div>
                </div>
                <div className="flex items-center space-x-3" style={{animationDelay: '1.5s'}}>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded-full animate-pulse w-4/5"></div>
                </div>
                <div className="flex items-center space-x-3" style={{animationDelay: '1.8s'}}>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded-full animate-pulse w-2/3"></div>
                </div>
              </div>
              
              {/* Bouton de simulation */}
              <div className="mt-8 flex justify-center">
                <div className="h-10 w-32 bg-gray-400 rounded-lg animate-pulse" style={{animationDelay: '2.1s'}}></div>
              </div>
            </div>
          </div>
        ) : renderedComponents ? (
          <div className="w-full h-full flex justify-center items-start py-8">
            <div className="max-w-6xl w-full px-4 space-y-6">
              <ComponentFactory componentData={renderedComponents} />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Container maxWidth="4xl" className="py-8">
              <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 text-center shadow-2xl">
                <Text size="xl" weight="bold" className="mb-4 text-gray-800">
                  Fraym
                </Text>
                <Text color="gray-700" className="mb-6">
                  Tapez votre message ci-dessous pour discuter avec la boutique.
                </Text>
              </div>
            </Container>
          </div>
        )}
      </div>

      {/* Zone de saisie avec glassmorphism avancé - Version responsive */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-6">
        <Container maxWidth="4xl">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Input
              placeholder="Décrivez l'interface que vous souhaitez générer..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-500 hover:bg-white/15 hover:backdrop-blur-3xl hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)] hover:scale-[1.02] focus:scale-[1.02] transform-gpu"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                borderImage: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1)) 1',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(31,38,135,0.37)'
              }}
              disabled={isLoading}
            />
            {/* Bouton Générer - Version icône */}
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="backdrop-blur-2xl bg-gradient-to-r from-blue-500/60 to-purple-600/60 hover:from-blue-600/70 hover:to-purple-700/70 border border-white/20 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-500 hover:scale-105 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transform-gpu"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(31,38,135,0.37)'
              }}
            >
              {/* Icône d'envoi (flèche) */}
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
            {/* Icône du cart */}
            <CartIcon
              itemCount={cart.totalItems}
              onClick={() => setShowCart(true)}
            />
            {/* Bouton Nouvelle session - Version icône */}
            <Button
              onClick={() => handleNewSession()}
              disabled={isLoading}
              className="backdrop-blur-2xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-500 hover:scale-105 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transform-gpu"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(31,38,135,0.37)'
              }}
            >
              {/* Icône de nouvelle session (plus) */}
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
          {error && (
            <div className="mt-3 sm:mt-4 backdrop-blur-2xl bg-red-500/15 border border-red-300/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(220,38,127,0.2)'
            }}>
              <Text color="red-700" size="sm">
                {error}
              </Text>
            </div>
          )}
        </Container>
      </div>
      
      {/* Modal du cart */}
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
};