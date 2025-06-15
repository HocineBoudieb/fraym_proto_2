import React from 'react';
import { Card } from './Card';
import { Image } from './Image';
import { Text } from './Text';
import { Button } from './Button';
import { Flex } from './Flex';
import { Grid } from './Grid';

interface ProductDetailProps {
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  description: string;
  features?: string[];
  specifications?: { [key: string]: string };
  rating?: number;
  reviewCount?: number;
  availability?: 'in-stock' | 'out-of-stock' | 'limited';
  category?: string;
  brand?: string;
  sku?: string;
  className?: string;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onWishlist?: () => void;
  [key: string]: any;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  title,
  price,
  originalPrice,
  image,
  images = [],
  description,
  features = [],
  specifications = {},
  rating,
  reviewCount,
  availability = 'in-stock',
  category,
  brand,
  sku,
  className = '',
  onAddToCart,
  onBuyNow,
  onWishlist,
  ...rest
}) => {
  const [selectedImage, setSelectedImage] = React.useState(image);
  const allImages = [image, ...images];

  const availabilityConfig = {
    'in-stock': { text: 'En stock', color: 'text-green-600', bgColor: 'bg-green-100' },
    'out-of-stock': { text: 'Rupture de stock', color: 'text-red-600', bgColor: 'bg-red-100' },
    'limited': { text: 'Stock limité', color: 'text-orange-600', bgColor: 'bg-orange-100' }
  };

  const currentAvailability = availabilityConfig[availability] || availabilityConfig['in-stock'];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={`max-w-4xl mx-auto p-2 sm:p-4 lg:p-6 ${className}`} {...rest}>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-8">
        {/* Section Images */}
        <div className="order-1 lg:order-1">
          <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl mb-2 sm:mb-3">
            <Image
              src={selectedImage}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {allImages.length > 1 && (
            <div className="flex space-x-1.5 sm:space-x-2 lg:space-x-3 overflow-x-auto pb-1">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 ${
                    selectedImage === img 
                      ? 'ring-1 sm:ring-2 ring-blue-500 ring-offset-1 sm:ring-offset-2 scale-105' 
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section Informations */}
        <div className="order-2 lg:order-2 space-y-2 sm:space-y-3 lg:space-y-4">
          {/* En-tête produit */}
          <div className="space-y-0.5 sm:space-y-1">
            {category && (
              <Text size="xs sm:sm" color="gray-600" className="uppercase tracking-wide">
                {category}
              </Text>
            )}
            <Text size="lg sm:xl lg:2xl" weight="bold" className="leading-tight">
              {title}
            </Text>
            {brand && (
              <Text size="sm" color="gray-700">
                Marque: {brand}
              </Text>
            )}
          </div>

          {/* Prix et disponibilité */}
          <div className="space-y-1.5 sm:space-y-2">
            <Flex className="items-center space-x-2">
              <Text size="lg sm:xl lg:2xl" weight="bold" color="blue-600">
                {price}
              </Text>
              {originalPrice && (
                <Text size="sm sm:md lg:lg" color="gray-500" className="line-through">
                  {originalPrice}
                </Text>
              )}
            </Flex>
            
            <div className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
              currentAvailability.color
            } ${currentAvailability.bgColor}`}>
              {currentAvailability.text}
            </div>
          </div>

          {/* Évaluation */}
          {rating && (
            <Flex className="items-center space-x-1.5 sm:space-x-2">
              <div className="flex">
                {renderStars(rating)}
              </div>
              <Text size="xs sm:sm" color="gray-600">
                {rating}/5
              </Text>
              {reviewCount && (
                <Text size="xs sm:sm" color="gray-500">
                  ({reviewCount} avis)
                </Text>
              )}
            </Flex>
          )}

          {/* Description */}
          <div className="space-y-0.5 sm:space-y-1">
            <Text size="sm" weight="semibold">
              Description
            </Text>
            <Text size="xs sm:sm" color="gray-700" className="leading-relaxed">
              {description}
            </Text>
          </div>

          {/* Caractéristiques */}
          {features.length > 0 && (
            <div className="space-y-0.5 sm:space-y-1">
              <Text size="sm" weight="semibold">
                Caractéristiques
              </Text>
              <ul className="space-y-0.5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-green-500 mt-0.5 text-xs">✓</span>
                    <Text size="xs" color="gray-700">
                      {feature}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Spécifications */}
          {Object.keys(specifications).length > 0 && (
            <div className="space-y-0.5 sm:space-y-1">
              <Text size="sm" weight="semibold">
                Spécifications
              </Text>
              <div className="bg-gray-50 rounded-lg p-2 space-y-0.5 sm:space-y-1">
                {Object.entries(specifications).map(([key, value]) => (
                  <Flex key={key} className="justify-between items-start">
                    <Text size="xs" weight="medium" color="gray-600" className="flex-shrink-0">
                      {key}:
                    </Text>
                    <Text size="xs" color="gray-800" className="text-right ml-2">
                      {value}
                    </Text>
                  </Flex>
                ))}
              </div>
            </div>
          )}

          {/* SKU */}
          {sku && (
            <Text size="xs" color="gray-500">
              SKU: {sku}
            </Text>
          )}

          {/* Boutons d'action */}
          <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
            <Flex className="space-x-2 sm:space-x-3">
              <Button
                color="blue"
                size="sm sm:md"
                className="flex-1 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl py-2 sm:py-3 hover:shadow-lg transition-all duration-200"
                onClick={onAddToCart}
                disabled={availability === 'out-of-stock'}
              >
                <span className="hidden sm:inline">Ajouter au panier</span>
                <span className="sm:hidden">Panier</span>
              </Button>
              <Button
                color="gray"
                variant="outline"
                size="sm sm:md"
                className="px-3 sm:px-4 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-200"
                onClick={onWishlist}
              >
                ♡
              </Button>
            </Flex>
            
            {availability !== 'out-of-stock' && (
              <Button
                color="green"
                size="sm sm:md"
                className="w-full text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl py-2 sm:py-3 hover:shadow-lg transition-all duration-200"
                onClick={onBuyNow}
              >
                <span className="hidden sm:inline">Acheter maintenant</span>
                <span className="sm:hidden">Acheter</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};