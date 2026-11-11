import React from 'react';
import { Product } from '../types/product';
import { ProductImage } from './ProductImage';
import { FreeDeliveryBadge } from './FreeDeliveryBadge';
import { DiscountBadge } from './DiscountBadge';
import { getProductPricing } from '../utils/pricing';
import { getProductHref } from '../utils/productRouting';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  index: number;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  index
}) => {
  const pricing = getProductPricing(product);

  const handleClick = (e: React.MouseEvent) => {
    // Standard left click opens without full page reload
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onSelectProduct(product);
    }
  };

  return (
    <a
      href={getProductHref(product)}
      onClick={handleClick}
      className="group cursor-pointer flex flex-col bg-white border border-neutral-200/80 hover:border-neutral-400 transition-all duration-200 text-inherit no-underline select-none"
    >
      {/* 1. Large prominent product image */}
      <div className="w-full relative overflow-hidden bg-neutral-100">
        {/* Floating Free Delivery badge neatly positioned in top-left */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 pointer-events-none">
          <FreeDeliveryBadge size="sm" />
        </div>

        {/* Floating Sale Discount badge in top-right */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 pointer-events-none">
          <DiscountBadge percentage={pricing.discountPercentage} size="sm" variant="solid" />
        </div>

        <ProductImage
          productId={product.id}
          src={product.images[0] || `/products/${product.id}/image-1.webp`}
          alt={product.name}
          category={product.category}
          aspectClassName="aspect-square"
          eager={index < 8}
        />
      </div>

      {/* Card Content: Product Name, Pricing with Cut Price & Discount, and Free Delivery */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between gap-2.5">
        <h3 className="text-sm md:text-[15px] font-medium text-neutral-900 group-hover:text-black line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <div className="pt-0.5 flex flex-col gap-2">
          {/* Price Block: Prominent selling price + Strikethrough original price + Discount badge */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm md:text-[15px] font-bold text-neutral-900 tabular-nums">
              {pricing.formattedSellingPrice}
            </span>
            <span className="text-xs text-neutral-400 line-through tabular-nums font-normal">
              {pricing.formattedOriginalPrice}
            </span>
            <DiscountBadge percentage={pricing.discountPercentage} size="sm" variant="subtle" />
          </div>

          <div className="flex items-center justify-between gap-1.5">
            <FreeDeliveryBadge size="sm" />
          </div>
        </div>
      </div>
    </a>
  );
};

export const ProductCard = React.memo(ProductCardComponent);


