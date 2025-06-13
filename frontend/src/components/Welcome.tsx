import React from 'react';
import { Heading } from './Heading';
import { Text } from './Text';

interface WelcomeProps {
  title?: string;
  subtitle?: string;
  className?: string;
  [key: string]: any;
}

export const Welcome: React.FC<WelcomeProps> = ({
  title = 'Bienvenue',
  subtitle,
  className = '',
  ...rest
}) => {
  return (
    <div className={`text-center py-8 ${className}`} {...rest}>
      <Heading level={1} className="mb-4">
        {title}
      </Heading>
      {subtitle && (
        <Text size="lg" color="gray-600">
          {subtitle}
        </Text>
      )}
    </div>
  );
};