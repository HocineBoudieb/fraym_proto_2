import React from 'react';
import { Button } from './Button';

interface NavigationProps {
  items: string[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  activeItem?: string;
  onItemClick?: (item: string) => void;
  [key: string]: any;
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  className = '',
  orientation = 'horizontal',
  activeItem,
  onItemClick,
  ...rest
}) => {
  const containerClasses = orientation === 'horizontal'
    ? 'flex flex-row space-x-4'
    : 'flex flex-col space-y-2';

  return (
    <nav className={`${containerClasses} ${className}`} {...rest}>
      {items.map((item, index) => (
        <Button
          key={index}
          variant={activeItem === item ? 'solid' : 'ghost'}
          color={activeItem === item ? 'blue' : 'gray'}
          onClick={() => onItemClick?.(item)}
          className="text-left"
        >
          {item}
        </Button>
      ))}
    </nav>
  );
};