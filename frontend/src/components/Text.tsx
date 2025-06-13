import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  [key: string]: any;
}

export const Text: React.FC<TextProps> = ({
  children,
  className = '',
  size = 'md',
  color = '',
  weight = 'normal',
  ...rest
}) => {
  // Mapping des tailles aux classes Tailwind
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  // Mapping des poids aux classes Tailwind
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const textSizeClass = sizeClasses[size];
  const textWeightClass = weightClasses[weight];
  const textColorClass = color ? `text-${color}` : '';

  return (
    <p
      className={`${textSizeClass} ${textWeightClass} ${textColorClass} ${className}`}
      {...rest}
    >
      {children}
    </p>
  );
};