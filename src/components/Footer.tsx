import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className="bg-white border-t border-neutral-200 text-neutral-900 pt-16 pb-12">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Store Name & Overview */}
            <div className="md:col-span-1">
              <span className="text-lg font-bold tracking-tight text-neutral-900 block mb-3">
                HOMEKIT
              </span>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Premium home essentials, kitchen tools, and smart lifestyle products crafted for ease and reliability.
              </p>
            </div>

            {/* Quick Links / About */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-4">
                About Us
              </h3>
              <ul className="space-y-2 text-xs text-neutral-600">
                <li>
                  <a href="#about-us" className="hover:text-black transition-colors">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href="#social-media" className="hover:text-black transition-colors">
                    Social Media Channels
                  </a>
                </li>
                <li>
                  <a href="#collection-header" className="hover:text-black transition-colors">
                    Product Catalog (89 items)
                  </a>
                </li>
                <li>
                  <span className="text-emerald-700 font-medium">Free Nationwide Delivery</span>
                </li>
              </ul>
            </div>

            {/* Contact Information Placeholder */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-4">
                Contact & 24/7 Support
              </h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p>WhatsApp: <a href="https://wa.me/923292284120" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-mono font-semibold hover:underline">+92 329 2284120</a></p>
                <p>Email: <a href="mailto:alyanarshad64@gmail.com" className="text-neutral-900 font-mono hover:underline">alyanarshad64@gmail.com</a></p>
                <p>Support: 24/7 Online Customer Care</p>
                <p className="text-neutral-400">Nationwide Cash on Delivery in Pakistan</p>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-4">
                Legal & Customer Care
              </h3>
              <ul className="space-y-2 text-xs text-neutral-600">
                <li>
                  <button 
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-black transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-black transition-colors text-left"
                  >
                    Terms and Conditions
                  </button>
                </li>
                <li>
                  <span className="text-neutral-500">Cash on Delivery Available</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
            <p>© {new Date().getFullYear()} HOMEKIT. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => setActiveModal('privacy')} className="hover:text-neutral-700">Privacy Policy</button>
              <span>·</span>
              <button onClick={() => setActiveModal('terms')} className="hover:text-neutral-700">Terms and Conditions</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-900">
                {activeModal === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-neutral-800 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>
            <div className="text-xs sm:text-sm text-neutral-600 space-y-3 leading-relaxed">
              {activeModal === 'privacy' ? (
                <>
                  <p>At HomeKit, we respect your privacy and protect personal data collected during order processing.</p>
                  <p>Customer contact information, delivery addresses, and phone numbers are utilized strictly for order verification, dispatch, and courier shipment via Cash on Delivery.</p>
                  <p>We do not sell, rent, or distribute personal customer data to unverified third parties.</p>
                </>
              ) : (
                <>
                  <p>Welcome to HomeKit. By accessing our catalog and placing orders, you agree to our standard service guidelines.</p>
                  <p>All items listed with price in Pakistani Rupees (PKR) reflect current stock availability. Orders are confirmed via customer phone verification before shipment.</p>
                  <p>Inspection and 7-day replacement warranty applies to manufacturing defects upon physical receipt.</p>
                </>
              )}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-2.5 bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
