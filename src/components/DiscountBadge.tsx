import React from 'react';

interface DiscountBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'solid' | 'subtle';
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  percentage,
  size = 'sm',
  className = '',
  variant = 'solid'
}) => {
  if (size === 'lg') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-sm bg-red-600 text-white text-xs font-bold tracking-wide shadow-xs select-none ${className}`}
      >
        {percentage}% OFF
      </span>
    );
  }

  if (size === 'md') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-sm bg-red-600 text-white text-[11px] font-bold tracking-wide shadow-xs select-none ${className}`}
      >
        {percentage}% OFF
      </span>
    );
  }

  // size === 'sm' (for product cards and compact views)
  if (variant === 'subtle') {
    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded-sm bg-red-50 text-red-600 border border-red-200/80 text-[10.5px] font-bold tracking-tight select-none ${className}`}
      >
        {percentage}% OFF
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-sm bg-red-600 text-white text-[10.5px] font-bold tracking-wide shadow-xs select-none ${className}`}
    >
      {percentage}% OFF
    </span>
  );
};
