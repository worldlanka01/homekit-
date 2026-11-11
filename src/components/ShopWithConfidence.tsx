import React from 'react';
import { Truck, Wallet, PackageCheck, Headset } from 'lucide-react';

const ShopWithConfidenceComponent: React.FC = () => {
  const cards = [
    {
      id: 'express-shipping',
      title: 'Express Shipping',
      description: 'Fast and reliable delivery right to your doorstep.',
      icon: Truck
    },
    {
      id: 'secure-cod',
      title: 'Secure COD',
      description: 'Shop conveniently with Cash on Delivery.',
      icon: Wallet
    },
    {
      id: 'open-parcel',
      title: 'Open Parcel Guarantee',
      description: 'Enjoy extra confidence with our open parcel facility.',
      icon: PackageCheck
    },
    {
      id: 'customer-support',
      title: 'Customer Support',
      description: "We're always here to help you with your shopping experience.",
      icon: Headset
    }
  ];

  return (
    <section id="shop-with-confidence" className="py-14 sm:py-20 border-t border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-500 mb-2 block">
            OUR CUSTOMER PROMISE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            Shop With Confidence
          </h2>
        </div>

        {/* 4 Feature Cards Grid:
            Desktop: All 4 cards in one horizontal row (lg:grid-cols-4)
            Tablet: 2 cards per row (sm:grid-cols-2)
            Mobile: 2-column or single-column layout depending on available screen width (grid-cols-1 min-[480px]:grid-cols-2)
        */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-start p-6 sm:p-7 rounded-2xl bg-[#f4effa] border border-[#e5dcf4] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-2xs border border-purple-100/90 flex items-center justify-center text-purple-950 mb-5 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight mb-2">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const ShopWithConfidence = React.memo(ShopWithConfidenceComponent);
