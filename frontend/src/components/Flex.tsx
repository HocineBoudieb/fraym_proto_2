import React from 'react';

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: number;
  className?: string;
  [key: string]: any;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 0,
  className = '',
  ...rest
}) => {
  // Mapping des directions aux classes Tailwind
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  // Mapping des justifications aux classes Tailwind
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  // Mapping des alignements aux classes Tailwind
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
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
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  };

  const baseClasses = 'flex';
  const flexDirectionClass = directionClasses[direction];
  const flexJustifyClass = justifyClasses[justify];
  const flexAlignClass = alignClasses[align];
  const flexGapClass = gapClasses[gap as keyof typeof gapClasses] || '';

  return (
    <div
      className={`${baseClasses} ${flexDirectionClass} ${flexJustifyClass} ${flexAlignClass} ${flexGapClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};