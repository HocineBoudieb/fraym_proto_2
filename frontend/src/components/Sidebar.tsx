import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <aside
      className={`bg-gray-50 border-r border-gray-200 ${className}`}
      {...rest}
    >
      {children}
    </aside>
  );
};