import React from 'react';
import { Button } from './Button';
import { Container } from './Container';
import { Grid } from './Grid';

interface ZaraCategoryButtonsProps {
  className?: string;
  onCategoryClick?: (category: string) => void;
  [key: string]: any;
}

export const ZaraCategoryButtons: React.FC<ZaraCategoryButtonsProps> = ({
  className = '',
  onCategoryClick,
  ...rest
}) => {
  const categories = [
    'Nouveautés',
    'Vestes & Manteaux',
    'Robes',
    'Pantalons',
    'Chaussures',
    'Accessoires'
  ];

  return (
    <Container maxWidth="6xl" className={`py-4 sm:py-6 md:py-8 px-2 sm:px-4 ${className}`} {...rest}>
      <Grid cols={2} gap={2} responsive={{ md: 3, lg: 6 }}>
        {categories.map((category, index) => (
          <Button
            key={index}
            variant="outline"
            color="black"
            size="sm"
            className="h-12 sm:h-14 md:h-16 text-center hover:bg-black hover:text-white transition-colors text-xs sm:text-sm md:text-base"
            onClick={() => onCategoryClick?.(category)}
          >
            {category}
          </Button>
        ))}
      </Grid>
    </Container>
  );
};