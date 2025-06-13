import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Header: React.FC<HeaderProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <header
      className={`bg-white shadow-sm border-b border-gray-200 ${className}`}
      {...rest}
    >
      {children}
    </header>
  );
};