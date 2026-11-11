import React from 'react';

const AboutUsComponent: React.FC = () => {
  return (
    <section id="about-us" className="py-16 bg-[#fafafa] border-t border-neutral-200">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 block mb-3">
          Our Philosophy
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight mb-4">
          Thoughtfully Designed Everyday Living
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal max-w-2xl mx-auto">
          HomeKit curates high-utility home innovations, precision grooming instruments, and smart kitchen essentials. We emphasize functional simplicity, dependable build quality, and transparent value delivered directly to households nationwide.
        </p>
      </div>
    </section>
  );
};

export const AboutUs = React.memo(AboutUsComponent);
