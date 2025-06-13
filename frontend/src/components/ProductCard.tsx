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
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`} {...rest}>
      <Image
        src={image}
        alt={title}
        className="w-full h-28 sm:h-32 md:h-40 object-cover"
      />
      <div className="p-2 sm:p-3">
        <Text size="sm" weight="semibold" className="mb-1 text-xs sm:text-sm md:text-base leading-tight">
          {title}
        </Text>
        <Text size="md" weight="bold" color="blue-600" className="mb-2 text-sm sm:text-base md:text-lg">
          {price}
        </Text>
        {description && (
          <Text size="xs" color="gray-600" className="mb-2 sm:mb-3 text-xs leading-tight">
            {description}
          </Text>
        )}
        <Button
          color="blue"
          size="sm"
          className="w-full text-xs sm:text-sm py-1 sm:py-2"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};