import React from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  [key: string]: any;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  ...rest
}) => {
  // Mapping des objectFit aux classes Tailwind
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  const objectFitClass = objectFitClasses[objectFit];

  // Styles pour width et height si fournis
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <img
      src={src}
      alt={alt}
      className={`${objectFitClass} ${className}`}
      style={style}
      {...rest}
    />
  );
};