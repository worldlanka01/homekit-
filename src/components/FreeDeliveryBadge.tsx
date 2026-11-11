import React from 'react';
import { Truck } from 'lucide-react';

interface FreeDeliveryBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FreeDeliveryBadge: React.FC<FreeDeliveryBadgeProps> = ({
  size = 'sm',
  className = ''
}) => {
  if (size === 'lg') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/95 border border-emerald-200/90 text-emerald-800 text-xs font-semibold tracking-wider uppercase shadow-xs select-none ${className}`}
      >
        <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>FREE DELIVERY</span>
      </span>
    );
  }

  if (size === 'md') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50/95 border border-emerald-200/90 text-emerald-800 text-[11px] font-semibold tracking-wider uppercase shadow-xs select-none ${className}`}
      >
        <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>FREE DELIVERY</span>
      </span>
    );
  }

  // size === 'sm' (for product cards)
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50/95 border border-emerald-200/90 text-emerald-800 text-[10px] sm:text-[10.5px] font-semibold tracking-wider uppercase shadow-xs select-none ${className}`}
    >
      <Truck className="w-3 h-3 text-emerald-600 shrink-0" />
      <span>FREE DELIVERY</span>
    </span>
  );
};
