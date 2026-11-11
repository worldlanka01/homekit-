import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const SocialMediaSectionComponent: React.FC = () => {
  const socialLinks = [
    {
      name: 'TikTok',
      handle: '@homekit.official',
      tagline: 'Watch viral home gadgets, unboxings & live demonstrations',
      url: 'https://www.tiktok.com/@homekit.official?is_from_webapp=1&sender_device=pc',
      badge: 'Trending Videos',
      borderColor: 'hover:border-neutral-900',
      accentGlow: 'group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]',
      iconBg: 'bg-black text-white group-hover:scale-110 transition-transform duration-300',
      // Authentic TikTok Logo
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.32V9.37a8.16 8.16 0 0 0 4.91 1.63v-3.45a4.85 4.85 0 0 1-1-.86z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      handle: '@homekit.official',
      tagline: 'Explore aesthetic home photography, customer reviews & reels',
      url: 'https://www.instagram.com/homekit.official?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==',
      badge: 'Visual Catalog',
      borderColor: 'hover:border-[#E1306C]',
      accentGlow: 'group-hover:shadow-[0_10px_30px_rgba(225,48,108,0.18)]',
      iconBg: 'bg-gradient-to-tr from-[#fdf497] via-[#fd5949] via-[#d6249f] to-[#285AEB] text-white group-hover:scale-110 transition-transform duration-300',
      // Authentic Instagram Logo
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      handle: 'HomeKit Official',
      tagline: 'Official community announcements, new arrivals & flash deals',
      url: 'https://www.facebook.com/profile.php?id=61595373781662',
      badge: 'Official Community',
      borderColor: 'hover:border-[#1877F2]',
      accentGlow: 'group-hover:shadow-[0_10px_30px_rgba(24,119,242,0.18)]',
      iconBg: 'bg-[#1877F2] text-white group-hover:scale-110 transition-transform duration-300',
      // Authentic Facebook Logo
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    }
  ];

  return (
    <section id="social-media" className="py-16 md:py-20 bg-neutral-50/70 border-t border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-500 mb-2 block">
            Official Social Media
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-3">
            Stay Connected With HomeKit
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Follow our verified social channels for hands-on video demos, customer unboxings, everyday home hacks, and exclusive discount announcements.
          </p>
        </div>

        {/* Responsive 3-Card Grid with Equal Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {socialLinks.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit HomeKit on ${platform.name}`}
              className={`group relative flex flex-col justify-between p-6 sm:p-7 bg-white border border-neutral-200 rounded-xl transition-all duration-300 hover:-translate-y-1 ${platform.borderColor} ${platform.accentGlow}`}
            >
              <div>
                {/* Header with authentic logo and badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${platform.iconBg}`}>
                    {platform.icon}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                    {platform.badge}
                  </span>
                </div>

                {/* Platform Name & Handle */}
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-black transition-colors flex items-center gap-1.5 mb-1">
                  <span>{platform.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs font-mono font-medium text-neutral-500 mb-3">
                  {platform.handle}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed mb-6">
                  {platform.tagline}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800 group-hover:text-black">
                <span>Follow on {platform.name}</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SocialMediaSection = React.memo(SocialMediaSectionComponent);
