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
      <Container maxWidth="6xl" className="py-2 sm:py-3 md:py-4 px-2 sm:px-4">
        <div className="flex items-center justify-between">
          <Text size="xl" weight="bold" className="text-white text-lg sm:text-xl md:text-2xl">
            ZARA
          </Text>
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
            <Text className="text-white hover:text-gray-300 cursor-pointer text-xs sm:text-sm md:text-base">
              FEMME
            </Text>
            <Text className="text-white hover:text-gray-300 cursor-pointer text-xs sm:text-sm md:text-base">
              HOMME
            </Text>
            <Text className="text-white hover:text-gray-300 cursor-pointer text-xs sm:text-sm md:text-base hidden sm:block">
              ENFANTS
            </Text>
            <Text className="text-white hover:text-gray-300 cursor-pointer text-xs sm:text-sm md:text-base hidden sm:block">
              MAISON
            </Text>
          </div>
        </div>
      </Container>
    </Header>
  );
};