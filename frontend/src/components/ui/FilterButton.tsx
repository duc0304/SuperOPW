import React from 'react';
import { IconType } from 'react-icons';

interface FilterButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  icon?: IconType;
  isActive?: boolean;
  className?: string;
}

export default function FilterButton({
  children,
  onClick,
  icon: Icon,
  isActive = false,
  className = '',
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-3d ${isActive ? 'btn-3d-filter-active' : 'btn-3d-filter'} btn-3d-sm flex items-center ${className}`}
    >
      {Icon && <Icon className={`h-5 w-5 mr-2 ${isActive ? 'text-primary-600 dark:text-indigo-300' : 'text-gray-400 dark:text-gray-300'}`} />}
      {children}
    </button>
  );
}