import React from 'react';
import { Card } from './Card';
import { Image } from './Image';
import { Text } from './Text';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  alt: string;
}

interface ZaraProductCardProps {
  product: Product;
  className?: string;
  onClick?: (product: Product) => void;
  [key: string]: any;
}

export const ZaraProductCard: React.FC<ZaraProductCardProps> = ({
  product,
  className = '',
  onClick,
  ...rest
}) => {
  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
      onClick={() => onClick?.(product)}
      {...rest}
    >
      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.alt}
          className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-2 sm:p-3">
        <Text size="xs" weight="medium" className="mb-1 text-gray-900 line-clamp-2 text-xs sm:text-sm leading-tight">
          {product.name}
        </Text>
        <Text size="xs" weight="semibold" className="text-black text-xs sm:text-sm">
          {product.price}
        </Text>
      </div>
    </Card>
  );
};