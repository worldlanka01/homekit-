import React from 'react';
import { MessageCircle, Share2, Sparkles, Truck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const handleScrollToSocial = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('social-media');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const announcementItem = (
    <div className="flex items-center gap-6 sm:gap-8 px-4 text-xs sm:text-[13px] font-medium tracking-wide">
      {/* Segment 1: Welcome */}
      <span className="inline-flex items-center gap-1.5 text-white whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-semibold">Welcome to HomeKit</span>
      </span>

      <span className="text-neutral-600 select-none">|</span>

      {/* Segment 2: Social Media */}
      <a
        href="#social-media"
        onClick={handleScrollToSocial}
        className="inline-flex items-center gap-1.5 text-neutral-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap group"
      >
        <Share2 className="w-3 h-3 text-neutral-400 group-hover:text-white transition-colors shrink-0" />
        <span className="underline-offset-4 group-hover:underline">Follow Us on Social Media</span>
      </a>

      <span className="text-neutral-600 select-none">|</span>

      {/* Segment 3: 24/7 Support */}
      <a
        href="https://wa.me/923292284120"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap group"
      >
        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold underline-offset-4 group-hover:underline">24/7 Customer Support</span>
      </a>

      <span className="text-neutral-600 select-none">|</span>

      {/* Segment 4: Free Delivery Highlight */}
      <span className="inline-flex items-center gap-1.5 text-emerald-300 whitespace-nowrap">
        <Truck className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[11px] uppercase tracking-wider font-semibold">Free Delivery Nationwide</span>
      </span>
    </div>
  );

  return (
    <div className="relative w-full bg-neutral-950 text-white overflow-hidden border-b border-neutral-800/80 select-none z-50">
      {/* Ambient gradient highlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />

      {/* Scrolling / Gliding Marquee Ticker */}
      <div className="py-2.5 overflow-hidden flex items-center">
        <div className="animate-marquee flex items-center shrink-0">
          {announcementItem}
          <span className="text-neutral-600 px-3 select-none">✦</span>
          {announcementItem}
          <span className="text-neutral-600 px-3 select-none">✦</span>
          {announcementItem}
          <span className="text-neutral-600 px-3 select-none">✦</span>
          {announcementItem}
          <span className="text-neutral-600 px-3 select-none">✦</span>
        </div>
      </div>
    </div>
  );
};
