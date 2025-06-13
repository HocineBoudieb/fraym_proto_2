import React from 'react';

interface FooterProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Footer: React.FC<FooterProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <footer
      className={`bg-gray-50 border-t border-gray-200 ${className}`}
      {...rest}
    >
      {children}
    </footer>
  );
};