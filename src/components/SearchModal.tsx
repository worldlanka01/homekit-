import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product } from '../types/product';
import { ALL_PRODUCTS } from '../data/products';
import { ProductImage } from './ProductImage';
import { getProductPricing } from '../utils/pricing';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory?: (category: string) => void;
}

const TRENDING_SEARCHES = [
  'Coffee Beater',
  'Mandoline Slicer',
  'Gas Burner Saver',
  'Steam Iron',
  'Rechargeable Blender',
  'Water Dispenser'
];

// Pre-indexed search metadata for zero-latency keystroke filtering
const SEARCHABLE_PRODUCTS = ALL_PRODUCTS.map((product) => ({
  product,
  nameLower: product.name.toLowerCase(),
  categoryLower: product.category.toLowerCase(),
  searchText: `${product.name} ${product.category} ${product.description} ${product.details.join(' ')}`.toLowerCase()
}));

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on open and reset query
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Smart Live Search Logic with pre-indexed search texts
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const searchTerms = q.split(/\s+/).filter(Boolean);

    return SEARCHABLE_PRODUCTS.filter(({ searchText }) => {
      return searchTerms.every((term) => searchText.includes(term));
    })
      .sort((a, b) => {
        // Prioritize matches that start with the query in the name
        const aStarts = a.nameLower.startsWith(q);
        const bStarts = b.nameLower.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      })
      .map((item) => item.product);
  }, [query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation through suggestions
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        onSelectProduct(results[selectedIndex]);
        onClose();
      }
    }
  };

  // Helper to highlight matching text in title
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const terms = q.trim().split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-amber-100 text-neutral-900 font-bold rounded-xs px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Search Panel Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200/90 overflow-hidden mt-2 sm:mt-10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
      >
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center gap-3 bg-white sticky top-0 z-10">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 shrink-0 ml-1" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search all 89 products, kitchen tools, personal care..."
            className="flex-1 text-sm sm:text-base md:text-lg font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden bg-transparent"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="h-6 w-px bg-neutral-200 hidden sm:block mx-1" />

          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors shrink-0"
          >
            <span className="hidden sm:inline">Esc</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Content Body */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-neutral-100"
        >
          {/* STATE 1: Empty Query - Show Trending & Category Shortcuts */}
          {!query.trim() && (
            <div className="py-3 space-y-6">
              <div>
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Trending Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-full transition-all cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  Popular Categories
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory('Kitchen & Dining');
                      onClose();
                    }}
                    className="p-3 text-left bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-xl transition-colors font-semibold text-neutral-900 flex items-center justify-between group"
                  >
                    <span>Kitchen & Dining</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory('Personal Care & Grooming');
                      onClose();
                    }}
                    className="p-3 text-left bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-xl transition-colors font-semibold text-neutral-900 flex items-center justify-between group"
                  >
                    <span>Personal Care</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Matching Results Found */}
          {query.trim() && results.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between pb-3 text-xs text-neutral-500 font-medium">
                <span>
                  Found <strong className="text-neutral-900">{results.length}</strong> matching{' '}
                  {results.length === 1 ? 'product' : 'products'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-neutral-400">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-mono border border-neutral-200">
                    ↵ Enter
                  </kbd>
                  <span>to open</span>
                </span>
              </div>

              <div className="space-y-1">
                {results.slice(0, 10).map((product, index) => {
                  const pricing = getProductPricing(product);
                  const isSelected = index === selectedIndex;

                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-neutral-100/90 ring-1 ring-neutral-300'
                          : 'hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white border border-neutral-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <ProductImage
                            productId={product.id}
                            src={product.images[0] || `/products/${product.id}/image-1.svg`}
                            alt={product.name}
                            category={product.category}
                            aspectClassName="aspect-square"
                          />
                        </div>

                        {/* Title & Category */}
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 leading-snug group-hover:text-black">
                            {highlightMatch(product.name, query)}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] sm:text-[11px] text-neutral-500 font-medium truncate">
                              {product.category}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100 hidden sm:inline">
                              Free Delivery
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center gap-3 shrink-0 ml-3 text-right">
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-neutral-900 block tabular-nums">
                            {pricing.formattedSellingPrice}
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-neutral-400 line-through tabular-nums block">
                            {pricing.formattedOriginalPrice}
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-neutral-200/60 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center transition-colors">
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All Matches Option if more than 10 */}
              {results.length > 10 && (
                <div className="pt-3 text-center">
                  <p className="text-xs text-neutral-500 mb-2">
                    Showing top 10 of {results.length} results
                  </p>
                  <button
                    onClick={() => {
                      if (results[0]) {
                        onSelectProduct(results[0]);
                        onClose();
                      }
                    }}
                    className="w-full py-2.5 text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    View First Result ({results[0]?.name})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STATE 3: No Results Found (EXACT REQUIRED MESSAGE) */}
          {query.trim() && results.length === 0 && (
            <div className="py-12 px-4 text-center">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-1.5">
                No products found
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Sorry, we couldn't find any products matching your search. Try another keyword.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="text-xs text-neutral-400 self-center mr-1">Try searching:</span>
                {['Coffee', 'Kitchen', 'Personal Care', 'Slicer'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-5 py-2.5 bg-neutral-50 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Search in HomeKit's 89 official catalog products</span>
          <span className="hidden sm:inline">Cash on Delivery & Free Delivery Nationwide</span>
        </div>
      </div>
    </div>
  );
};
