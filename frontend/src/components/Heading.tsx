import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  [key: string]: any;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  className = '',
  color = '',
  align = 'center',
  ...rest
}) => {
  // Mapping des niveaux aux tailles Tailwind responsive
  const sizeClasses = {
    1: 'text-2xl sm:text-3xl md:text-4xl font-bold',
    2: 'text-xl sm:text-2xl md:text-3xl font-bold',
    3: 'text-lg sm:text-xl md:text-2xl font-semibold',
    4: 'text-base sm:text-lg md:text-xl font-semibold',
    5: 'text-sm sm:text-base md:text-lg font-medium',
    6: 'text-xs sm:text-sm md:text-base font-medium',
  };

  // Mapping des alignements aux classes Tailwind
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const headingSizeClass = sizeClasses[level];
  const headingAlignClass = alignClasses[align];
  const headingColorClass = color ? `text-${color}` : '';

  const Tag = `h${level}` as React.ElementType;

  return (
    <Tag
      className={`${headingSizeClass} ${headingAlignClass} ${headingColorClass} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};