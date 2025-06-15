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
    <Card className={`max-w-4xl mx-auto ${className}`} padding="2 sm:4" {...rest}>
      <Grid className="grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Section Images */}
        <div className="space-y-2 sm:space-y-3">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={selectedImage}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {allImages.length > 1 && (
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === img ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section Informations */}
        <div className="space-y-3 sm:space-y-4">
          {/* En-tête produit */}
          <div className="space-y-1">
            {category && (
              <Text size="sm" color="gray-600" className="uppercase tracking-wide">
                {category}
              </Text>
            )}
            <Text size="2xl" weight="bold" className="leading-tight">
              {title}
            </Text>
            {brand && (
              <Text size="md" color="gray-700">
                Marque: {brand}
              </Text>
            )}
          </div>

          {/* Prix et disponibilité */}
          <div className="space-y-2">
            <Flex className="items-center space-x-2 sm:space-x-3">
              <Text size="xl sm:2xl" weight="bold" color="blue-600">
                {price}
              </Text>
              {originalPrice && (
                <Text size="md sm:lg" color="gray-500" className="line-through">
                  {originalPrice}
                </Text>
              )}
            </Flex>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              availabilityConfig[availability].color
            } ${availabilityConfig[availability].bgColor}`}>
              {availabilityConfig[availability].text}
            </div>
          </div>

          {/* Évaluation */}
          {rating && (
            <Flex className="items-center space-x-2">
              <div className="flex">
                {renderStars(rating)}
              </div>
              <Text size="sm" color="gray-600">
                {rating}/5
              </Text>
              {reviewCount && (
                <Text size="sm" color="gray-500">
                  ({reviewCount} avis)
                </Text>
              )}
            </Flex>
          )}

          {/* Description */}
          <div className="space-y-1">
            <Text size="sm sm:md" weight="semibold">
              Description
            </Text>
            <Text size="xs sm:sm" color="gray-700" className="leading-relaxed">
              {description}
            </Text>
          </div>

          {/* Caractéristiques */}
          {features.length > 0 && (
            <div className="space-y-1">
              <Text size="sm sm:md" weight="semibold">
                Caractéristiques
              </Text>
              <ul className="space-y-0.5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-1 sm:space-x-2">
                    <span className="text-green-500 mt-0.5 text-xs sm:text-sm">✓</span>
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
            <div className="space-y-1">
              <Text size="sm sm:md" weight="semibold">
                Spécifications
              </Text>
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 space-y-1">
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
          <div className="space-y-2 pt-2 sm:pt-3">
            <Flex className="space-x-1 sm:space-x-2">
              <Button
                color="blue"
                size="sm sm:md"
                className="flex-1 text-xs sm:text-sm"
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
                className="px-2 sm:px-3"
                onClick={onWishlist}
              >
                ♡
              </Button>
            </Flex>
            
            {availability !== 'out-of-stock' && (
              <Button
                color="green"
                size="sm sm:md"
                className="w-full text-xs sm:text-sm"
                onClick={onBuyNow}
              >
                <span className="hidden sm:inline">Acheter maintenant</span>
                <span className="sm:hidden">Acheter</span>
              </Button>
            )}
          </div>
        </div>
      </Grid>
    </Card>
  );
};