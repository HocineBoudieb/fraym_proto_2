import React from 'react';
import { Card } from './Card';
import { Image } from './Image';
import { Text } from './Text';
import { Button } from './Button';

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  description?: string;
  buttonText?: string;
  className?: string;
  onButtonClick?: () => void;
  [key: string]: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  image,
  description,
  buttonText = 'Voir plus',
  className = '',
  onButtonClick,
  ...rest
}) => {
  return (
    <div className={`cursor-pointer group ${className}`} {...rest}>
      {/* Image avec coins arrondis */}
      <div className="relative overflow-hidden rounded-xl mb-3">
        <Image
          src={image}
          alt={title}
          className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Contenu texte */}
      <div className="space-y-2">
        <div className="space-y-1">
          <Text size="sm" weight="semibold" className="text-gray-900 line-clamp-2 text-sm sm:text-base leading-tight group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </Text>
          <Text size="lg" weight="bold" className="text-gray-900 text-base sm:text-lg md:text-xl">
            {price}
          </Text>
        </div>
        {description && (
          <Text size="xs" color="gray-600" className="text-xs sm:text-sm leading-relaxed line-clamp-2">
            {description}
          </Text>
        )}
        {buttonText && (
          <Button
            color="blue"
            size="sm"
            className="w-full text-xs sm:text-sm py-2 font-medium hover:shadow-lg transition-all duration-200 rounded-lg"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};