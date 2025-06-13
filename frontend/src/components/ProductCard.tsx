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
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <Text size="md" weight="semibold" className="mb-1">
          {title}
        </Text>
        <Text size="lg" weight="bold" color="blue-600" className="mb-2">
          {price}
        </Text>
        {description && (
          <Text size="xs" color="gray-600" className="mb-3">
            {description}
          </Text>
        )}
        <Button
          color="blue"
          size="sm"
          className="w-full"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};