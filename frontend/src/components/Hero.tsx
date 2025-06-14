import React from 'react';
import { Heading } from './Heading';
import { Text } from './Text';
import { Button } from './Button';

interface HeroProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  backgroundImage?: string;
  className?: string;
  onButtonClick?: () => void;
  [key: string]: any;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  buttonText,
  backgroundImage,
  className = '',
  onButtonClick,
  ...rest
}) => {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <div
      className={`relative py-12 sm:py-16 md:py-20 px-2 sm:px-4 text-center ${className}`}
      style={backgroundStyle}
      {...rest}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      <div className="relative z-10 max-w-4xl mx-auto">
        <Heading level={1} className="mb-4 sm:mb-6">
          {title}
        </Heading>
        {subtitle && (
          <Text size="lg" className="mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            {subtitle}
          </Text>
        )}
        {buttonText && (
          <Button
            size="lg"
            color="blue"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};