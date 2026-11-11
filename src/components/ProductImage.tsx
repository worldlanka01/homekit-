import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Tv, 
  Activity, 
  Wrench, 
  Baby, 
  ShoppingBag,
  Package
} from 'lucide-react';
import { REGENERATED_PRODUCT_IMAGES } from '../data/productImageMap';

interface ProductImageProps {
  productId: string;
  src: string;
  alt: string;
  category?: string;
  className?: string;
  aspectClassName?: string;
  eager?: boolean;
}

const ProductImageComponent: React.FC<ProductImageProps> = ({
  productId,
  src,
  alt,
  category = '',
  className = '',
  aspectClassName = 'aspect-square',
  eager = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Compute the initial primary source candidate
  const getInitialSrc = () => {
    // 1. If custom uploaded photo exists for this product in localStorage
    try {
      const customImg = localStorage.getItem(`custom_product_image_${productId}`);
      if (customImg) return customImg;
    } catch {
      // Ignore
    }

    // 2. If an explicit resolved source is passed (e.g. data URL, blob, or custom secondary view)
    if (src && !src.includes('placeholder')) {
      // If src is the default placeholder svg/webp pattern, prefer the high-res regenerated image
      const isDefaultPlaceholder =
        src.endsWith('/image-1.svg') ||
        src.endsWith('/image-1.webp') ||
        src === `/products/${productId}/image-1.svg`;

      if (isDefaultPlaceholder && REGENERATED_PRODUCT_IMAGES[productId]) {
        return REGENERATED_PRODUCT_IMAGES[productId];
      }

      return src;
    }

    // 3. High-resolution photographic asset from image map
    if (REGENERATED_PRODUCT_IMAGES[productId]) {
      return REGENERATED_PRODUCT_IMAGES[productId];
    }

    // 4. Fallback to product SVG asset
    return `/products/${productId}/image-1.svg`;
  };

  const [activeSrc, setActiveSrc] = useState(getInitialSrc);

  useEffect(() => {
    setActiveSrc(getInitialSrc());
    setImageError(false);
    setIsLoaded(false);
  }, [productId, src]);

  const handleImageError = () => {
    // If regenerated image or custom image fails, try dedicated product SVG asset once
    const svgFallback = `/products/${productId}/image-1.svg`;
    if (activeSrc !== svgFallback && activeSrc !== '') {
      setActiveSrc(svgFallback);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  const getCategoryIcon = () => {
    const cat = category.toLowerCase();
    const name = alt.toLowerCase();
    
    if (cat.includes('kitchen') || name.includes('slicer') || name.includes('cutter') || name.includes('juicer') || name.includes('pot') || name.includes('scale')) {
      return <Utensils className="w-12 h-12 text-neutral-400 stroke-1" />;
    }
    if (cat.includes('personal') || cat.includes('grooming') || name.includes('shaver') || name.includes('trimmer') || name.includes('comb') || name.includes('wax')) {
      return <Sparkles className="w-12 h-12 text-neutral-400 stroke-1" />;
    }
    if (cat.includes('electronics') || name.includes('fan') || name.includes('lamp') || name.includes('camera') || name.includes('earbuds') || name.includes('tracker')) {
      return <Tv className="w-12 h-12 text-neutral-400 stroke-1" />;
    }
    if (cat.includes('fitness') || cat.includes('wellness') || name.includes('massager') || name.includes('gripper') || name.includes('scale')) {
      return <Activity className="w-12 h-12 text-neutral-400 stroke-1" />;
    }
    if (cat.includes('tools') || cat.includes('automotive') || name.includes('screw') || name.includes('cover') || name.includes('mop')) {
      return <Wrench className="w-12 h-12 text-neutral-400 stroke-1" />;
    }
    if (cat.includes('baby') || name.includes('pacifier') || name.includes('lock')) {
      return <Baby className="w-12 h-12 text-neutral-400 stroke-1" />;
    }
    return <Package className="w-12 h-12 text-neutral-400 stroke-1" />;
  };

  return (
    <div className={`relative overflow-hidden bg-[#f6f6f7] flex items-center justify-center select-none ${aspectClassName} ${className}`}>
      {!imageError && (
        <img
          src={activeSrc}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}

      {/* Styled Minimalist Studio Fallback only on genuine failure */}
      {imageError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#f9f9fa] to-[#f0f0f2]">
          <div className="w-20 h-20 rounded-full bg-white/70 shadow-sm flex items-center justify-center mb-3 border border-neutral-200/60">
            {getCategoryIcon()}
          </div>
          <p className="text-[11px] font-medium text-neutral-500 tracking-wider uppercase mb-1 line-clamp-1">
            {category || 'Product'}
          </p>
          <p className="text-[12px] font-semibold text-neutral-800 line-clamp-2 max-w-[85%] leading-tight">
            {alt}
          </p>
          <span className="text-[10px] text-neutral-400 mt-1 font-mono tracking-wide">
            ID: #{productId}
          </span>
        </div>
      )}
    </div>
  );
};

export const ProductImage = React.memo(ProductImageComponent);
