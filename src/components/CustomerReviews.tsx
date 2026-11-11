import React from 'react';
import { Star } from 'lucide-react';

// Exactly 6 Customer Reviews in 2 animated scrolling rows (3 in Top Row, 3 in Bottom Row)
export const CUSTOMER_REVIEWS_ROW_1 = [
  {
    name: 'Hamza',
    initial: 'H',
    bg: 'bg-indigo-600 text-white',
    text: 'Excellent product quality! Exactly what I was looking for. Very happy with my purchase.'
  },
  {
    name: 'Madiha',
    initial: 'M',
    bg: 'bg-rose-500 text-white',
    text: 'Really loved the product. The quality is great, and the overall experience was amazing.'
  },
  {
    name: 'Ali',
    initial: 'A',
    bg: 'bg-emerald-600 text-white',
    text: 'Great value for money. The product looks exactly as shown on the website.'
  }
];

export const CUSTOMER_REVIEWS_ROW_2 = [
  {
    name: 'Saba',
    initial: 'S',
    bg: 'bg-amber-600 text-white',
    text: 'Very nice product with good quality. I would definitely recommend it.'
  },
  {
    name: 'Aqeel',
    initial: 'A',
    bg: 'bg-blue-600 text-white',
    text: 'Good experience with HomeKit. Easy ordering process and a great product.'
  },
  {
    name: 'Ayesha',
    initial: 'A',
    bg: 'bg-purple-600 text-white',
    text: 'Absolutely loved it! The product is useful, well-designed, and worth buying.'
  }
];

// Duplicated for gapless, infinite marquee animation
const REVIEWS_LOOP_ROW_1 = [
  ...CUSTOMER_REVIEWS_ROW_1,
  ...CUSTOMER_REVIEWS_ROW_1,
  ...CUSTOMER_REVIEWS_ROW_1,
  ...CUSTOMER_REVIEWS_ROW_1
];

const REVIEWS_LOOP_ROW_2 = [
  ...CUSTOMER_REVIEWS_ROW_2,
  ...CUSTOMER_REVIEWS_ROW_2,
  ...CUSTOMER_REVIEWS_ROW_2,
  ...CUSTOMER_REVIEWS_ROW_2
];

interface CustomerReviewsProps {
  className?: string;
}

const CustomerReviewsComponent: React.FC<CustomerReviewsProps> = ({ className = '' }) => {
  return (
    <section className={`pt-12 pb-14 rounded-3xl bg-[#f4effa] border border-[#e5dcf4] overflow-hidden ${className}`}>
      {/* Section Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-2.5">
          Our Customers Love Us
        </h2>
        <div className="inline-flex items-center justify-center gap-2 flex-wrap text-xs sm:text-sm text-neutral-700 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full border border-purple-200/60 shadow-2xs">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-bold text-neutral-900">4.9 out of 5.0</span>
          <span className="text-neutral-400">·</span>
          <span className="text-neutral-600 font-medium">148 Customer Reviews</span>
        </div>
      </div>

      {/* Dual Infinite Horizontal Scrolling Review Rows with Edge Fades */}
      <div className="relative w-full space-y-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* Top Row: Moves continuously from Right to Left */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee flex gap-4 sm:gap-5 pr-4 sm:pr-5">
            {REVIEWS_LOOP_ROW_1.map((item, idx) => (
              <div
                key={`top-rev-${idx}`}
                className="w-[280px] sm:w-[330px] p-5 sm:p-6 bg-white rounded-2xl border border-neutral-100 shadow-xs flex flex-col justify-between shrink-0 select-none hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs ${item.bg}`}>
                      {item.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 leading-tight">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-0.5 mt-1 text-amber-400">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star key={starIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                    "{item.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Moves continuously from Left to Right */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee-reverse flex gap-4 sm:gap-5 pr-4 sm:pr-5">
            {REVIEWS_LOOP_ROW_2.map((item, idx) => (
              <div
                key={`bot-rev-${idx}`}
                className="w-[280px] sm:w-[330px] p-5 sm:p-6 bg-white rounded-2xl border border-neutral-100 shadow-xs flex flex-col justify-between shrink-0 select-none hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs ${item.bg}`}>
                      {item.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 leading-tight">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-0.5 mt-1 text-amber-400">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star key={starIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                    "{item.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const CustomerReviews = React.memo(CustomerReviewsComponent);
