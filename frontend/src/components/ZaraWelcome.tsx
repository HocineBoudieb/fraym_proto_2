import React from 'react';
import { Welcome } from './Welcome';
import { Text } from './Text';

interface ZaraWelcomeProps {
  className?: string;
  [key: string]: any;
}

export const ZaraWelcome: React.FC<ZaraWelcomeProps> = ({
  className = '',
  ...rest
}) => {
  return (
    <div className={`bg-gray-50 py-12 ${className}`} {...rest}>
      <Welcome
        title="Découvrez la nouvelle collection"
        subtitle="Explorez nos dernières tendances mode pour cette saison"
        className="max-w-4xl mx-auto"
      />
      <div className="text-center mt-8">
        <Text size="lg" color="gray-600">
          Comment puis-je vous aider aujourd'hui ?
        </Text>
      </div>
    </div>
  );
};