import React, { useState, useEffect } from 'react';
import type { ChatResponse, ComponentTree, Cart as CartType } from '../types';
import { ComponentFactory } from '../services/componentRenderer';
import { sendMessage, createSession, autoRegister, getCart, addToCart } from '../services/api';
import { saveAuthData, getAuthData, updateCurrentSession, saveSessionData, getSessionDataByIP, clearCurrentSessionData } from '../services/storage';
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
import { SplashScreen } from './SplashScreen';

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

// Fonction pour ajouter un produit au panier
const addProductToCart = async (productId: string, productName: string, quantity: number, unitPrice: number, apiKey: string) => {
  try {
    console.log('🛒 Ajout au panier:', { productId, productName, quantity, unitPrice });    
    const response = await addToCart(productId, productName, quantity, unitPrice, apiKey);
    
    console.log('🛒 Réponse ajout panier:', response);
    return response;
  } catch (error) {
    console.error('🛒 Erreur ajout panier:', error);
    throw error;
  }
};

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



export const ChatApp: React.FC<ChatAppProps> = ({ className = '' }) => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [renderedComponents, setRenderedComponents] = useState<ComponentTree | null>(null);
  const [previousComponents, setPreviousComponents] = useState<ComponentTree | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNewContent, setIsNewContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentApiKey, setCurrentApiKey] = useState<string | null>(null);
  const [cart, setCart] = useState<CartType>({ items: [], totalItems: 0, totalPrice: 0 });
  const [showCart, setShowCart] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [showSplashScreen, setShowSplashScreen] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);
  const [splashCurrentStep, setSplashCurrentStep] = useState(0);

  // Charger les données d'authentification au démarrage
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        // Étape 1: Authentification
        setSplashCurrentStep(0);
        setSplashProgress(10);
        
        let authData = await getAuthData();
        
        // Vérifier si les données existent et ne sont pas expirées
        const isExpired = authData?.expiresAt && new Date(authData.expiresAt) < new Date();
        
        if (!authData?.apiKey || isExpired) {
          // Enregistrement automatique
          console.log('Enregistrement automatique en cours...');
          setSplashProgress(25);
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
        setSplashProgress(40);
        
        // Étape 2: Création/Restauration de session
        setSplashCurrentStep(1);
        setSplashProgress(50);
        
        // Vérifier s'il y a une session sauvegardée pour cette IP
        const savedSessionData = await getSessionDataByIP();
        console.log('🔄 Données de session sauvegardées trouvées:', savedSessionData);
        
        if (savedSessionData && savedSessionData.sessionId) {
          // Restaurer la session précédente
          setCurrentSessionId(savedSessionData.sessionId);
          setSplashProgress(70);
          if (savedSessionData.lastComponents) {
            setRenderedComponents(savedSessionData.lastComponents);
            console.log('✅ Composants restaurés depuis la session sauvegardée');
          }
          
          // Mettre à jour les données d'auth avec la session restaurée
          authData.currentSessionId = savedSessionData.sessionId;
          await saveAuthData(authData);
        } else if (!authData.currentSessionId) {
          // Créer une nouvelle session si aucune session sauvegardée
          await handleNewSession();
        } else {
          setCurrentSessionId(authData.currentSessionId);
          setSplashProgress(70);
        }
        
        // Étape 3: Initialisation du chat
        // Envoyer le message de bienvenue
        
        setSplashCurrentStep(2);
        setSplashProgress(85);
        const welcomeMessage = "Accueille moi, suggère moi trois produits, résume moi cette boutique";
        await handleSendMessage(welcomeMessage);
        // Finalisation
        setSplashProgress(100);
        
        // Attendre un peu pour que l'utilisateur voie la progression complète
        setTimeout(() => {
          setShowSplashScreen(false);
        }, 500);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'authentification:', error);
        setError('Erreur lors de l\'initialisation. Veuillez recharger la page.');
        setShowSplashScreen(false);
      }
    };

    // Afficher le splash screen au démarrage
    setShowSplashScreen(true);
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
      console.error('🛒 Stack trace:', (error as Error).stack);
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
  
  const createNewSessionWithProgress = async (apiKey: string) => {
    try {
      setSplashProgress(55);
      const session = await createSession(apiKey);
      setCurrentSessionId(session.id);
      setSplashProgress(65);
      
      // Mettre à jour les données d'authentification avec la session
      const authData = await getAuthData();
      if (authData) {
        authData.currentSessionId = session.id;
        await saveAuthData(authData);
      }
      setSplashProgress(70);
      
    } catch (error) {
      console.error('Erreur lors de la création de session:', error);
      setError('Erreur lors de la création de session.');
      throw error;
    }
  };

  // Fonction pour démarrer une nouvelle session
  const handleNewSession = async () => {
    if (!currentApiKey) return;
    
    // Afficher le splash screen avec progression
    setShowSplashScreen(true);
    setSplashCurrentStep(0);
    setSplashProgress(0);
    setIsLoading(true);
    setError(null);
    
    try {
      // Étape 1: Authentification (déjà faite, mais on simule)
      setSplashCurrentStep(0);
      setSplashProgress(20);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Étape 2: Création de session
      setSplashCurrentStep(1);
      setSplashProgress(30);
      
      // Effacer les données de session sauvegardées
      await clearCurrentSessionData();
      console.log('🗑️ Données de session précédentes effacées');
      setSplashProgress(40);
      
      // Réinitialiser l'état de l'interface
      setRenderedComponents(null);
      setPreviousComponents(null);
      setIsTransitioning(false);
      setIsNewContent(false);
      setInputMessage('');
      setSuggestion(null);
      setSplashProgress(50);
      
      // Créer une nouvelle session
      await createNewSession(currentApiKey);
      setSplashProgress(70);
      
      // Étape 3: Initialisation du chat
      setSplashCurrentStep(2);
      setSplashProgress(80);
      
      // Envoyer automatiquement le message de bienvenue pendant le splash screen
      const welcomeMessage = "Accueille moi, suggère moi trois produits, résume moi cette boutique";
      await handleSendMessage(welcomeMessage);
      setSplashProgress(100);
      
      // Attendre un peu pour que l'utilisateur voie la progression complète
      setTimeout(() => {
        setShowSplashScreen(false);
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors de la création d\'une nouvelle session:', error);
      setError('Erreur lors de la création d\'une nouvelle session.');
      setShowSplashScreen(false);
    } finally {
      setIsLoading(false);
    }
  };
  


  // Cette section contenait auparavant la fonction handleConnect qui a été remplacée par l'authentification automatique

  // Envoi de message
  // Fonction pour gérer le clic sur la suggestion
  const handleSuggestionClick = () => {
    if (suggestion) {
      handleSendMessage(suggestion);
      setSuggestion(null); // Effacer la suggestion après l'envoi
    }
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim();
    if (!content || !currentSessionId || !currentApiKey) return;

    setIsLoading(true);
    setError(null);
    
    // Sauvegarder les composants actuels pour la transition
    if (renderedComponents) {
      setPreviousComponents(renderedComponents);
      setIsTransitioning(true);
    }

    try {
      if (!messageContent) {
        setInputMessage('');
      }

      // Envoyer le message à l'API
      const response: ChatResponse = await sendMessage(currentSessionId, currentApiKey, content);
      
      console.log('🔍 Réponse API reçue:', response);
      console.log('🎨 Composants dans la réponse:', response.components);
      console.log('💡 Suggestion reçue:', response.suggestion);
      
      // Mettre à jour la suggestion
      setSuggestion(response.suggestion || null);
      
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
        
        // Si on a des composants précédents, attendre un peu pour l'animation de disparition
        if (isTransitioning && previousComponents) {
          setTimeout(() => {
            setRenderedComponents(componentsToRender);
            setIsNewContent(true);
            setIsTransitioning(false);
            setPreviousComponents(null);
            console.log('🚀 État renderedComponents mis à jour avec transition');
            
            // Réinitialiser isNewContent après les animations
            setTimeout(() => {
              setIsNewContent(false);
            }, 2000);
          }, 800); // Délai pour permettre l'animation de vibration
        } else {
          setRenderedComponents(componentsToRender);
          setIsNewContent(true);
          console.log('🚀 État renderedComponents mis à jour');
          
          // Réinitialiser isNewContent après les animations
          setTimeout(() => {
            setIsNewContent(false);
          }, 2000);
        }
        
        // Sauvegarder les composants dans la base de données locale
        if (currentSessionId) {
          await saveSessionData(currentSessionId, componentsToRender);
          console.log('💾 Composants sauvegardés pour la session:', currentSessionId);
        }
      } else {
        console.log('❌ Aucun composant trouvé dans la réponse');
        setIsTransitioning(false);
        setPreviousComponents(null);
      }
      
      // Hide splash screen when response is received
      if (showSplashScreen) {
        setShowSplashScreen(false);
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setError('Erreur lors de l\'envoi du message.');
      setIsTransitioning(false);
      setPreviousComponents(null);
      // Hide splash screen on error too
      if (showSplashScreen) {
        setShowSplashScreen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Interface de chargement pendant l'authentification automatique
  if (!isConnected) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto">
          {/* Header avec logo centré */}
            <div className="flex justify-center">
              <img 
                src="/fraym_demo_logo.png" 
                alt="Logo de la boutique" 
                className="h-28 w-auto"
              />
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
      </div>
    );
  }

  // Interface de rendu des composants
  return (
    <div className={`flex flex-col h-screen ${className}`}>
      {/* Zone de contenu dynamique - Rendu des composants */}
      <div className="flex-1 overflow-y-auto pb-0">
        {/* Header avec logo centré - maintenant dans la zone scrollable */}
          <div className="flex justify-center">
            <img 
              src="/fraym_demo_logo.png" 
              alt="Logo de la boutique" 
              className="h-30 w-auto"
            />
          </div>
        {(renderedComponents || (isTransitioning && previousComponents)) ? (
          <div className="relative w-full h-full">
            {/* Loader overlay pendant la génération */}
            {isLoading && (
              <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-8">
                <div className="backdrop-blur-xl bg-white/90 border border-white/40 rounded-2xl px-6 py-4 shadow-2xl animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <Text size="sm" weight="medium" className="text-gray-800">
                      Génération en cours...
                    </Text>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`w-full h-full flex justify-center items-start pt-0 py-8 transition-all duration-500 ${
              isLoading ? 'opacity-80' : 'opacity-100'
            }`}>
              <div className={`max-w-6xl w-full px-4 space-y-6 ${
                isLoading && isTransitioning
                  ? 'animate-vibrate' 
                  : !isLoading && renderedComponents
                  ? 'animate-slideInUp'
                  : ''
              }`}>
                {(isTransitioning && previousComponents && isLoading 
                   ? previousComponents 
                   : renderedComponents) && (
                  <ComponentFactory 
                     componentData={
                       isTransitioning && previousComponents && isLoading 
                         ? previousComponents 
                         : renderedComponents!
                     }
                     isNewContent={!isLoading && isNewContent}
                   />
                )}
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Container maxWidth="4xl" className="py-8">
              <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 text-center shadow-2xl animate-pulse">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <Text size="xl" weight="bold" className="mb-4 text-gray-800">
                  Génération en cours...
                </Text>
                <Text color="gray-700" className="mb-6">
                  Création de votre contenu personnalisé
                </Text>
              </div>
            </Container>
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
          {/* Affichage de la suggestion */}
          {suggestion && (
            <div className="mb-3 sm:mb-4">
              <div 
                onClick={handleSuggestionClick}
                className="backdrop-blur-2xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-700/30 border border-white/30 rounded-2xl px-4 py-3 cursor-pointer transition-all duration-300 hover:scale-[1.02] transform-gpu shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]"
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(147,51,234,0.15) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(31,38,135,0.2)'
                }}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <Text className="text-gray-700 text-sm font-medium flex-1">
                    {suggestion}
                  </Text>
                  <Text className="text-xs text-gray-500 opacity-75">
                    Cliquez pour envoyer
                  </Text>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Input
              placeholder="Écrivez un message..."
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
      
      {/* Splash Screen pour nouvelle session */}
      {showSplashScreen && (
        <SplashScreen 
          currentStep={splashCurrentStep}
          progress={splashProgress}
        />
      )}
    </div>
  );
};