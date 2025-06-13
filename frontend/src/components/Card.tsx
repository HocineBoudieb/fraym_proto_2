import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  shadow?: string;
  [key: string]: any;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = '4',
  shadow = 'md',
  ...rest
}) => {
  // Mapping des ombres aux classes Tailwind
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    none: '',
  };

  // Mapping des paddings aux classes Tailwind
  const paddingClasses = {
    '0': 'p-0',
    '1': 'p-1',
    '2': 'p-2',
    '3': 'p-3',
    '4': 'p-4',
    '5': 'p-5',
    '6': 'p-6',
    '8': 'p-8',
    '10': 'p-10',
    '12': 'p-12',
  };

  const baseClasses = 'bg-white rounded-lg';
  const cardShadowClass = shadowClasses[shadow as keyof typeof shadowClasses] || shadowClasses.md;
  const cardPaddingClass = paddingClasses[padding as keyof typeof paddingClasses] || paddingClasses['4'];

  return (
    <div
      className={`${baseClasses} ${cardShadowClass} ${cardPaddingClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};