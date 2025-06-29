import React from 'react';
import type { ComponentTree } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Text } from '../components/Text';
import { Heading } from '../components/Heading';
import { Image } from '../components/Image';
import { Input } from '../components/Input';
import { Container } from '../components/Container';
import { Grid } from '../components/Grid';
import { Flex } from '../components/Flex';
import { ProductCard } from '../components/ProductCard';
import { ProductDetail } from '../components/ProductDetail';
import { Hero } from '../components/Hero';
import { Navigation } from '../components/Navigation';
import { ZaraHeader } from '../components/ZaraHeader';
import { ZaraWelcome } from '../components/ZaraWelcome';
import { ZaraCategoryButtons } from '../components/ZaraCategoryButtons';
import { ZaraProductGrid } from '../components/ZaraProductGrid';
import { ZaraProductCard } from '../components/ZaraProductCard';
import { ZaraMessageInput } from '../components/ZaraMessageInput';
import { ZaraContainer } from '../components/ZaraContainer';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Sidebar } from '../components/Sidebar';
import { Welcome } from '../components/Welcome';

// Mapping des types de composants aux composants React
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
  ProductDetail,
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

/**
 * Fonction qui rend un arbre de composants à partir d'une structure JSON
 */
export const renderComponent = (componentTree: ComponentTree, animationIndex?: number, isNewContent?: boolean): React.ReactNode => {
  // Si c'est une chaîne de caractères, la retourner directement
  if (typeof componentTree === 'string') {
    return componentTree;
  }
  
  // Si c'est un tableau, rendre chaque élément avec des animations séquentielles
  if (Array.isArray(componentTree)) {
    return componentTree.map((component, index) => {
      // Générer un délai aléatoire pour l'animation
      const randomDelay = isNewContent ? Math.random() * 1.5 : 0;
      const staggerClass = isNewContent ? `animate-staggered-${(index % 6) + 1}` : '';
      
      return (
        <div 
          key={index} 
          className={staggerClass}
          style={isNewContent ? { animationDelay: `${randomDelay}s` } : {}}
        >
          {renderComponent(component, index, isNewContent)}
        </div>
      );
    });
  }
  
  // C'est un composant unique
  const { type, component, props } = componentTree;
  const componentType = type || component;
  
  if (!componentType) {
    console.warn('Type de composant manquant:', componentTree);
    return null;
  }
  
  const Component = componentMap[componentType as keyof typeof componentMap];
  
  if (!Component) {
    console.warn(`Composant non trouvé: ${componentType}`);
    return null;
  }
  
  // Traiter les enfants récursivement si nécessaire
  const processedProps = { ...(props || {}) };
  if (props?.children) {
    processedProps.children = renderComponent(props.children, animationIndex, isNewContent) as any;
  }
  
  // Ajouter l'animation pour les nouveaux composants
  if (isNewContent && animationIndex !== undefined) {
    const randomDelay = Math.random() * 1.5;
    const staggerClass = `animate-staggered-${(animationIndex % 6) + 1}`;
    
    return (
      <div 
        className={staggerClass}
        style={{ animationDelay: `${randomDelay}s` }}
      >
        <Component {...processedProps} />
      </div>
    );
  }
  
  return <Component {...processedProps} />;
};

// Interface pour ComponentFactory avec support des animations
interface ComponentFactoryProps {
  componentData: ComponentTree;
  isNewContent?: boolean;
}

// ComponentFactory pour rendre les composants dynamiquement
export function ComponentFactory({ componentData, isNewContent = false }: ComponentFactoryProps) {
  console.log('🏭 ComponentFactory appelé avec:', componentData, 'isNewContent:', isNewContent);
  
  // Si c'est une chaîne, la retourner directement
  if (typeof componentData === 'string') {
    return <div>{componentData}</div>;
  }
  
  return <>{renderComponent(componentData, 0, isNewContent)}</>;
}