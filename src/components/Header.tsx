import React, { useState } from 'react';
import { Product } from '../types/product';
import { ShoppingBag, Search, Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onHomeClick: () => void;
  onSelectCategory?: (category: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onHomeClick,
  onSelectCategory,
  onSelectProduct
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (callback?: () => void) => {
    setIsMobileMenuOpen(false);
    if (callback) callback();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-18 sm:h-20 flex items-center justify-between relative">
        {/* ======================================================== */}
        {/* LEFT SIDE – Navigation Menu (Desktop) + Mobile Menu Trigger */}
        {/* ======================================================== */}
        <div className="flex items-center gap-3 lg:gap-8 z-10">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-neutral-800 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop Navigation Links with Equal Spacing */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-[13px] font-semibold tracking-wider text-neutral-600 uppercase">
            <button
              onClick={onHomeClick}
              className="hover:text-black transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              All Products
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('Kitchen & Dining')}
              className="hover:text-black transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Kitchen
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('Personal Care & Grooming')}
              className="hover:text-black transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Personal Care
            </button>
            <a
              href="#social-media"
              className="hover:text-black transition-colors whitespace-nowrap py-1"
            >
              Social Media
            </a>
            <a
              href="#about-us"
              className="hover:text-black transition-colors whitespace-nowrap py-1"
            >
              About Us
            </a>
          </nav>
        </div>

        {/* ======================================================== */}
        {/* CENTER – HOMEKIT LOGO (Mathematical Exact Horizontal Center) */}
        {/* ======================================================== */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-auto">
          <button
            onClick={onHomeClick}
            aria-label="HomeKit Homepage"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden py-1 px-1.5"
          >
            {/* Authentic Brand Logo Mark */}
            <img
              src="/assets/aistudio/homekit_logo__85588975.jpeg"
              alt="HomeKit Logo"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-8 sm:h-10 lg:h-11 w-auto object-contain shrink-0 rounded-xs group-hover:scale-105 transition-transform duration-200"
            />
            {/* Bold, Sharp, Increased Size Brand Wordmark */}
            <span className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-neutral-900 group-hover:text-black transition-colors">
              HOMEKIT
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* RIGHT SIDE – Search & Cart Icons (Grouped with proper spacing) */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 sm:gap-3.5 z-10">
          {/* Smart Live Product Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search all products"
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer group"
          >
            <Search className="w-5 h-5 text-neutral-700 group-hover:text-black transition-colors" />
            <span className="hidden lg:inline text-xs font-semibold text-neutral-600 group-hover:text-black">
              Search
            </span>
          </button>

          {/* Cart Icon Button with Count Badge */}
          <button
            onClick={onOpenCart}
            aria-label="View Shopping Cart"
            className="flex items-center gap-2 py-2 px-3 sm:px-3.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs hover:shadow transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden sm:inline font-bold">Cart</span>
            <span className="bg-white text-neutral-900 text-[11px] font-black px-1.5 py-0.2 rounded-full tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE NAVIGATION DRAWER                                 */}
      {/* ======================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/aistudio/homekit_logo__85588975.jpeg"
                    alt="HomeKit"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="font-black text-lg text-neutral-900">HOMEKIT</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Bar Quick Button */}
              <div className="p-4 border-b border-neutral-100">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-100 text-neutral-500 hover:text-neutral-900 text-xs font-medium transition-colors"
                >
                  <Search className="w-4 h-4 text-neutral-400" />
                  <span>Search products...</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => handleNavClick(onHomeClick)}
                  className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-bold text-neutral-900 hover:bg-neutral-50 text-left"
                >
                  <span>All Products</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() =>
                    handleNavClick(() => onSelectCategory && onSelectCategory('Kitchen & Dining'))
                  }
                  className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50 text-left"
                >
                  <span>Kitchen</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() =>
                    handleNavClick(() =>
                      onSelectCategory && onSelectCategory('Personal Care & Grooming')
                    )
                  }
                  className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50 text-left"
                >
                  <span>Personal Care</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>

                <a
                  href="#social-media"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50 text-left"
                >
                  <span>Social Media</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </a>

                <a
                  href="#about-us"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50 text-left"
                >
                  <span>About Us</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </a>
              </nav>
            </div>

            {/* Mobile Drawer Footer with 24/7 Support */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50">
              <a
                href="https://wa.me/923292284120"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>24/7 WhatsApp Support</span>
              </a>
              <p className="text-[11px] text-center text-neutral-400 mt-2">
                Nationwide Cash on Delivery in Pakistan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SMART LIVE PRODUCT SEARCH MODAL                          */}
      {/* ======================================================== */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => {
          if (onSelectProduct) onSelectProduct(product);
          setIsSearchOpen(false);
        }}
        onSelectCategory={(category) => {
          if (onSelectCategory) onSelectCategory(category);
          setIsSearchOpen(false);
        }}
      />
    </header>
  );
};
