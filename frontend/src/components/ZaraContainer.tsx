import React from 'react';
import { ZaraHeader } from './ZaraHeader';
import { ZaraWelcome } from './ZaraWelcome';
import { ZaraCategoryButtons } from './ZaraCategoryButtons';
import { ZaraProductGrid } from './ZaraProductGrid';
import { ZaraMessageInput } from './ZaraMessageInput';

interface ZaraContainerProps {
  className?: string;
  onCategoryClick?: (category: string) => void;
  onProductClick?: (product: any) => void;
  onSend?: (message: string) => void;
  onVoiceInput?: () => void;
  [key: string]: any;
}

export const ZaraContainer: React.FC<ZaraContainerProps> = ({
  className = '',
  onCategoryClick,
  onProductClick,
  onSend,
  onVoiceInput,
  ...rest
}) => {
  return (
    <div className={`min-h-screen bg-white flex flex-col ${className}`} {...rest}>
      <ZaraHeader />
      
      <main className="flex-1">
        <ZaraWelcome />
        <ZaraCategoryButtons onCategoryClick={onCategoryClick} />
        <ZaraProductGrid onProductClick={onProductClick} />
      </main>
      
      <ZaraMessageInput 
        onSend={onSend}
        onVoiceInput={onVoiceInput}
        className="sticky bottom-0"
      />
    </div>
  );
};