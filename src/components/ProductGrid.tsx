import React from 'react';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  activeCategory?: string;
  onClearCategory?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  activeCategory,
  onClearCategory
}) => {
  return (
    <section id="collection-header" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10">
      {/* Category Filter Indicator if filtered */}
      {activeCategory && (
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-neutral-400">Category:</span>
            <span className="text-sm font-semibold text-neutral-900">{activeCategory}</span>
            <span className="text-xs text-neutral-500 font-mono">({products.length} items)</span>
          </div>
          {onClearCategory && (
            <button
              onClick={onClearCategory}
              className="text-xs font-semibold text-neutral-600 hover:text-black underline"
            >
              View All Products
            </button>
          )}
        </div>
      )}

      {/* Professional Shopify-inspired grid: 
          Desktop: 4 products per row (lg:grid-cols-4)
          Tablet: 2–3 products per row (sm:grid-cols-2 md:grid-cols-3)
          Mobile: 2 products per row (grid-cols-2)
      */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};
