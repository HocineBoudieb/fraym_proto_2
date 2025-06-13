import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
  padding?: string;
  [key: string]: any;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
  padding = '4',
  ...rest
}) => {
  // Mapping des largeurs maximales aux classes Tailwind
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
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

  const baseClasses = 'mx-auto';
  const containerMaxWidthClass = maxWidthClasses[maxWidth];
  const containerPaddingClass = paddingClasses[padding as keyof typeof paddingClasses] || paddingClasses['4'];

  return (
    <div
      className={`${baseClasses} ${containerMaxWidthClass} ${containerPaddingClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};