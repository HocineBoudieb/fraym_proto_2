import React from 'react';
import { Button } from './Button';
import { Text } from './Text';

interface CartIconProps {
  itemCount: number;
  onClick: () => void;
  className?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({ itemCount, onClick, className = '' }) => {
  return (
    <Button
      onClick={onClick}
      className={`relative backdrop-blur-2xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-500 hover:scale-105 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)] transform-gpu ${className}`}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(31,38,135,0.37)'
      }}
    >
      {/* Icône du panier */}
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V7a2 2 0 00-2-2H9a2 2 0 00-2 2v1" />
      </svg>
      
      {/* Badge avec le nombre d'articles */}
      {itemCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg">
          <Text size="xs" weight="bold" className="text-white leading-none">
            {itemCount > 99 ? '99+' : itemCount}
          </Text>
        </div>
      )}
    </Button>
  );
};