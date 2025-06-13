import React from 'react';

interface InputProps {
  placeholder?: string;
  className?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  [key: string]: any;
}

export const Input: React.FC<InputProps> = ({
  placeholder = '',
  className = '',
  type = 'text',
  value,
  onChange,
  disabled = false,
  ...rest
}) => {
  const baseClasses = 'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`${baseClasses} ${disabledClasses} ${className}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...rest}
    />
  );
};