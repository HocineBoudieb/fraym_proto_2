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
export const renderComponent = (componentTree: ComponentTree): React.ReactNode => {
  // Si c'est une chaîne de caractères, la retourner directement
  if (typeof componentTree === 'string') {
    return componentTree;
  }
  
  // Si c'est un tableau, rendre chaque élément
  if (Array.isArray(componentTree)) {
    return componentTree.map((component, index) => (
      <React.Fragment key={index}>
        {renderComponent(component)}
      </React.Fragment>
    ));
  }
  
  // C'est un composant unique
  const { type, props } = componentTree;
  const Component = componentMap[type];
  
  if (!Component) {
    console.warn(`Composant non trouvé: ${type}`);
    return null;
  }
  
  // Traiter les enfants récursivement si nécessaire
  const processedProps = { ...props };
  if (props.children) {
    processedProps.children = renderComponent(props.children) as any;
  }
  
  return <Component {...processedProps} />;
};