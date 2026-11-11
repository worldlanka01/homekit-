import React from 'react';
import { Flame, Eye } from 'lucide-react';
import { useProductRecentSales, useProductLiveViewers } from '../utils/socialProof';

interface SocialProofBadgesProps {
  productId: string;
  className?: string;
}

export const SocialProofBadges: React.FC<SocialProofBadgesProps> = ({ productId, className = '' }) => {
  const salesInfo = useProductRecentSales(productId);
  const liveViewers = useProductLiveViewers(productId);

  // If no social proof data is available, do not render fake notifications
  if (!salesInfo && liveViewers <= 0) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2.5 select-none ${className}`}>
      {/* 1. Recent Sales Notification */}
      {salesInfo && salesInfo.count > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/90 border border-amber-200/80 shadow-2xs text-xs font-medium text-amber-950 transition-all">
          <span className="flex items-center justify-center w-5 h-5 rounded-md bg-amber-500/15 text-amber-600 shrink-0">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
          </span>
          <span className="leading-tight">
            <strong className="font-bold text-amber-900">{salesInfo.count} sold</strong>{' '}
            <span className="text-amber-800/90">{salesInfo.timeWindow}</span>
          </span>
        </div>
      )}

      {/* 2. Live People Viewing Counter */}
      {liveViewers > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50/90 border border-neutral-200/80 shadow-2xs text-xs font-medium text-neutral-800 transition-all">
          <span className="relative flex items-center justify-center w-5 h-5 rounded-md bg-neutral-200/70 text-neutral-700 shrink-0">
            <Eye className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </span>
          <span className="leading-tight">
            <strong className="font-bold text-neutral-900">{liveViewers}</strong>{' '}
            <span className="text-neutral-600">
              {liveViewers === 1 ? 'person is' : 'people are'} viewing this product right now
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
