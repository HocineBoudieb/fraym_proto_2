import React from 'react';

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: number;
  className?: string;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  [key: string]: any;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 4,
  className = '',
  responsive,
  ...rest
}) => {
  // Mapping des colonnes aux classes Tailwind
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  // Mapping des gaps aux classes Tailwind
  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    7: 'gap-7',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
    16: 'gap-16',
  };

  const baseClasses = 'grid justify-items-center';
  const gridColsClass = colsClasses[cols];
  const gridGapClass = gapClasses[gap as keyof typeof gapClasses] || gapClasses[4];

  // Classes responsive
  let responsiveClasses = '';
  if (responsive) {
    if (responsive.sm) responsiveClasses += ` sm:grid-cols-${responsive.sm}`;
    if (responsive.md) responsiveClasses += ` md:grid-cols-${responsive.md}`;
    if (responsive.lg) responsiveClasses += ` lg:grid-cols-${responsive.lg}`;
    if (responsive.xl) responsiveClasses += ` xl:grid-cols-${responsive.xl}`;
  }

  return (
    <div
      className={`${baseClasses} ${gridColsClass} ${gridGapClass} ${responsiveClasses} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};