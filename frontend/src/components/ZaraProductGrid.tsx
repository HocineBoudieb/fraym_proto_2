import React from 'react';
import { Container } from './Container';
import { Grid } from './Grid';
import { ZaraProductCard } from './ZaraProductCard';

interface ZaraProductGridProps {
  className?: string;
  onProductClick?: (product: any) => void;
  [key: string]: any;
}

export const ZaraProductGrid: React.FC<ZaraProductGridProps> = ({
  className = '',
  onProductClick,
  ...rest
}) => {
  // Données de produits intégrées
  const products = [
    {
      id: 1,
      name: "Trench à double épaisseur",
      price: "119,00 €",
      image: "https://static.zara.net/photos//2023/I/0/1/p/2753/144/800/2/w/563/2753144800_1_1_1.jpg",
      alt: "Trench coat beige"
    },
    {
      id: 2,
      name: "Robe midi plissée",
      price: "49,95 €",
      image: "https://static.zara.net/photos//2023/I/0/1/p/4387/144/800/2/w/563/4387144800_1_1_1.jpg",
      alt: "Robe midi plissée noire"
    },
    {
      id: 3,
      name: "Blazer oversize",
      price: "79,95 €",
      image: "https://static.zara.net/photos//2023/I/0/1/p/1564/144/800/2/w/563/1564144800_1_1_1.jpg",
      alt: "Blazer oversize gris"
    },
    {
      id: 4,
      name: "Pantalon taille haute",
      price: "39,95 €",
      image: "https://static.zara.net/photos//2023/I/0/1/p/6688/144/800/2/w/563/6688144800_1_1_1.jpg",
      alt: "Pantalon taille haute noir"
    },
    {
      id: 5,
      name: "Pull en maille côtelée",
      price: "29,95 €",
      image: "https://static.zara.net/photos//2023/I/0/1/p/5536/144/800/2/w/563/5536144800_1_1_1.jpg",
      alt: "Pull en maille côtelée beige"
    },
    {
      id: 6,
      name: "Jupe midi en cuir",
      price: "69,95 €",
      image: "https://static.zara.net/photos//2023/I/0/1/p/2969/144/800/2/w/563/2969144800_1_1_1.jpg",
      alt: "Jupe midi en cuir noir"
    }
  ];

  return (
    <Container maxWidth="6xl" className={`py-8 ${className}`} {...rest}>
      <Grid cols={2} gap={8} responsive={{ sm: 3, md: 4, lg: 5 }}>
        {products.map((product) => (
          <ZaraProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
          />
        ))}
      </Grid>
    </Container>
  );
};