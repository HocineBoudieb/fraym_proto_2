import React from 'react';
import { Header } from './Header';
import { Container } from './Container';
import { Text } from './Text';

interface ZaraHeaderProps {
  className?: string;
  [key: string]: any;
}

export const ZaraHeader: React.FC<ZaraHeaderProps> = ({
  className = '',
  ...rest
}) => {
  return (
    <Header className={`bg-black text-white ${className}`} {...rest}>
      <Container maxWidth="6xl" className="py-4">
        <div className="flex items-center justify-between">
          <Text size="2xl" weight="bold" className="text-white">
            ZARA
          </Text>
          <div className="flex items-center space-x-6">
            <Text className="text-white hover:text-gray-300 cursor-pointer">
              FEMME
            </Text>
            <Text className="text-white hover:text-gray-300 cursor-pointer">
              HOMME
            </Text>
            <Text className="text-white hover:text-gray-300 cursor-pointer">
              ENFANTS
            </Text>
            <Text className="text-white hover:text-gray-300 cursor-pointer">
              MAISON
            </Text>
          </div>
        </div>
      </Container>
    </Header>
  );
};