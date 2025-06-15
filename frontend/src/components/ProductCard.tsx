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
    <Card 
      className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-gray-200 ${className}`} 
      shadow="sm"
      {...rest}
    >
      <div className="relative overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={title}
          className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      </div>
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="space-y-1">
          <Text size="sm" weight="semibold" className="text-gray-900 line-clamp-2 text-sm sm:text-base leading-tight group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </Text>
          <Text size="lg" weight="bold" color="blue-600" className="text-base sm:text-lg md:text-xl">
            {price}
          </Text>
        </div>
        {description && (
          <Text size="xs" color="gray-600" className="text-xs sm:text-sm leading-relaxed line-clamp-2">
            {description}
          </Text>
        )}
        <Button
          color="blue"
          size="sm"
          className="w-full text-xs sm:text-sm py-2 sm:py-2.5 font-medium hover:shadow-md transition-all duration-200 group-hover:bg-blue-700"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};