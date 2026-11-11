import React from 'react';

// Independent hero banner asset generated specifically for the store header
import heroBannerImage from '../assets/images/regenerated_image_1794291211180.png';

interface HeroProps {
  onExploreClick?: () => void;
}

const HeroComponent: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative w-full bg-[#f4f2ee] overflow-hidden border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative aspect-[21/9] min-h-[300px] max-h-[500px] w-full flex items-center justify-start overflow-hidden">
          {/* Permanent Independent Wide Banner Image */}
          <img
            src={heroBannerImage}
            alt="HomeKit Flagship Store Essentials"
            className="absolute inset-0 w-full h-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />

          {/* Measured Elegant Scrim for WCAG AA Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

          {/* Minimal Elegant Typography */}
          <div className="relative z-10 px-6 sm:px-12 md:px-16 lg:px-20 max-w-xl text-white">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-neutral-200 mb-2 sm:mb-3 block">
              Curated Essentials 2026
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-[1.15] mb-4">
              Modern Living, <br />
              <span className="font-semibold">Elevated Simply.</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed mb-6 max-w-md hidden sm:block">
              Explore 89 meticulously chosen kitchen innovations, personal wellness tools, and home gadgets delivered directly to your doorstep.
            </p>
            {onExploreClick && (
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-neutral-900 text-xs sm:text-sm font-semibold tracking-wide hover:bg-neutral-100 transition-colors"
              >
                Shop All 89 Products
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Hero = React.memo(HeroComponent);
