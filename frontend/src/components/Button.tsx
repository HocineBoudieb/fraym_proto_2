import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'gray' | 'black' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  color = 'blue',
  size = 'md',
  variant = 'solid',
  onClick,
  disabled = false,
  ...rest
}) => {
  // Mapping des couleurs aux classes Tailwind
  const colorClasses = {
    solid: {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      red: 'bg-red-600 hover:bg-red-700 text-white',
      gray: 'bg-gray-600 hover:bg-gray-700 text-white',
      black: 'bg-black hover:bg-gray-900 text-white',
      white: 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300',
    },
    outline: {
      blue: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
      green: 'border border-green-600 text-green-600 hover:bg-green-50',
      red: 'border border-red-600 text-red-600 hover:bg-red-50',
      gray: 'border border-gray-600 text-gray-600 hover:bg-gray-50',
      black: 'border border-black text-black hover:bg-gray-100',
      white: 'border border-white text-white hover:bg-gray-800',
    },
    ghost: {
      blue: 'text-blue-600 hover:bg-blue-50',
      green: 'text-green-600 hover:bg-green-50',
      red: 'text-red-600 hover:bg-red-50',
      gray: 'text-gray-600 hover:bg-gray-50',
      black: 'text-black hover:bg-gray-100',
      white: 'text-white hover:bg-gray-800',
    },
  };

  // Mapping des tailles aux classes Tailwind responsive
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base',
    lg: 'px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg',
    xl: 'px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl',
  };

  const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const variantColorClasses = colorClasses[variant][color];
  const buttonSizeClasses = sizeClasses[size];

  return (
    <button
      className={`${baseClasses} ${variantColorClasses} ${buttonSizeClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};