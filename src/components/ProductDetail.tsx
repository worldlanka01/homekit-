import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types/product';
import { ALL_PRODUCTS } from '../data/products';
import { ProductImage } from './ProductImage';
import { ProductCard } from './ProductCard';
import { FreeDeliveryBadge } from './FreeDeliveryBadge';
import { DiscountBadge } from './DiscountBadge';
import { getProductPricing } from '../utils/pricing';
import { REGENERATED_PRODUCT_IMAGES } from '../data/productImageMap';
import { 
  ArrowLeft, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ShoppingBag,
  Camera,
  Headset,
  Banknote,
  ArrowRight
} from 'lucide-react';
import { CustomerReviews } from './CustomerReviews';
import { SocialProofBadges } from './SocialProofBadges';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
  onOrderNow: (product: Product, quantity: number) => void;
  onOpenImageUpload: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onAddToCart,
  onOrderNow,
  onOpenImageUpload,
  onSelectProduct
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const pricing = getProductPricing(product);

  // Reset gallery and quantity when switching products
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setIsAddedFeedback(false);
  }, [product.id]);

  // Compute exactly 4 related products preferring same category and excluding current product
  const relatedProducts = useMemo(() => {
    const otherProducts = ALL_PRODUCTS.filter((p) => p.id !== product.id);
    const sameCategory = otherProducts.filter((p) => p.category === product.category);
    const differentCategory = otherProducts.filter((p) => p.category !== product.category);
    return [...sameCategory, ...differentCategory].slice(0, 4);
  }, [product.id, product.category]);

  const productImages = useMemo(() => {
    const list: string[] = [];

    // 1. Check for custom uploaded image in localStorage
    try {
      const customImg = localStorage.getItem(`custom_product_image_${product.id}`);
      if (customImg) list.push(customImg);
    } catch {
      // Ignore
    }

    // 2. High-res regenerated photographic image for this product
    if (REGENERATED_PRODUCT_IMAGES[product.id]) {
      if (!list.includes(REGENERATED_PRODUCT_IMAGES[product.id])) {
        list.push(REGENERATED_PRODUCT_IMAGES[product.id]);
      }
    }

    // 3. For products with dedicated secondary asset photography
    const knownMultiImageIds = new Set(['2108', '2125', '2151', '2134', '2141', '2356', '2388', '2406', '2372', '2415']);
    if (knownMultiImageIds.has(product.id)) {
      const sec = `/products/${product.id}/image-2.svg`;
      if (!list.includes(sec)) {
        list.push(sec);
      }
    }

    // Fallback if none matched
    if (list.length === 0) {
      list.push(product.images[0] || `/products/${product.id}/image-1.svg`);
    }

    return list;
  }, [product.id, product.images]);

  const currentImage = productImages[selectedImageIndex] || productImages[0];

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>
        <span className="text-xs text-neutral-400 font-mono">
          Product ID: #{product.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full relative bg-neutral-100 border border-neutral-200 overflow-hidden">
            {/* Free Delivery & Sale floating badges */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none flex items-center gap-2">
              <FreeDeliveryBadge size="md" />
              <DiscountBadge percentage={pricing.discountPercentage} size="md" />
            </div>

            <ProductImage
              productId={product.id}
              src={currentImage}
              alt={product.name}
              category={product.category}
              aspectClassName="aspect-square sm:aspect-[4/3] lg:aspect-square"
              eager={true}
            />
            {/* Custom Image Upload affordance specifically for this product */}
            <button
              onClick={() => onOpenImageUpload(product)}
              title="Add or update photo for this product"
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-neutral-700 hover:text-black rounded-full shadow-sm border border-neutral-200 text-xs flex items-center gap-1.5 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium text-[11px]">Set Image</span>
            </button>
          </div>

          {/* Thumbnails Gallery (isolated strictly to this product's image array) */}
          {productImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {productImages.map((img, idx) => (
                <button
                  key={`${product.id}-thumb-${idx}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 shrink-0 border-2 overflow-hidden transition-all bg-neutral-50 ${
                    selectedImageIndex === idx ? 'border-black' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <ProductImage
                    productId={product.id}
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    category={product.category}
                    aspectClassName="aspect-square"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 leading-tight mb-4">
            {product.name}
          </h1>

          {/* Pricing Block with Strikethrough Original Price, Prominent Selling Price, and Discount Badge */}
          <div className="mb-6 pb-6 border-b border-neutral-200 flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 tabular-nums">
                {pricing.formattedSellingPrice}
              </span>
              <span className="text-base sm:text-lg text-neutral-400 line-through tabular-nums font-normal">
                {pricing.formattedOriginalPrice}
              </span>
              <DiscountBadge percentage={pricing.discountPercentage} size="md" />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <FreeDeliveryBadge size="md" />
              <span className="text-xs text-neutral-600 bg-neutral-100 px-2.5 py-1 font-medium rounded-full">
                In Stock · Cash on Delivery
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                You Save PKR {pricing.discountAmount.toLocaleString()} ({pricing.discountPercentage}%)
              </span>
            </div>

            {/* Dynamic Real-Time Social Proof: Recent Sales & Live Viewing Counter */}
            <SocialProofBadges productId={product.id} className="pt-1.5" />
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              Quantity
            </label>
            <div className="inline-flex items-center border border-neutral-300">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 mb-8">
            {/* Subtle Glassmorphism Badge above Order Now Button */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200/90 shadow-2xs text-[11px] sm:text-xs text-neutral-800 font-medium select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <span className="font-semibold text-neutral-900">Order with Cash on Delivery</span>
                <span className="text-neutral-300 font-light select-none">|</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Free Delivery
                </span>
              </div>
            </div>

            {/* Primary Order Now Button - Opens the WhatsApp Order Checkout Form */}
            <button
              onClick={() => onOrderNow(product, quantity)}
              className="w-full py-4 px-6 text-sm sm:text-base font-bold tracking-wide bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1ca64f] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Order Now</span>
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCartClick}
              className={`w-full py-3.5 px-6 text-sm font-semibold tracking-wide border border-black transition-all flex items-center justify-center gap-2 ${
                isAddedFeedback 
                  ? 'bg-neutral-900 text-white' 
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {isAddedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-5 border-y border-neutral-200 text-xs text-neutral-600 mb-8">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-emerald-950">Free Delivery (2-4 Days)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>Verified Product Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>Easy 7-Day Returns</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-2">
              Description
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          </div>

            {/* Specifications & Details */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-3">
                Product Specifications
              </h2>
              <ul className="space-y-2 text-sm text-neutral-600">
                {product.details.map((detail, index) => (
                  <li key={`${product.id}-detail-${index}`} className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-1 font-bold">·</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. WHY SHOP WITH HOMEKIT? & 2. CONTACT SUPPORT SECTIONS */}
        {/* ======================================================== */}
        <section className="mt-14 sm:mt-18 pt-10 sm:pt-12 pb-10 sm:pb-12 px-4 sm:px-8 rounded-3xl bg-[#f8f9fa] border border-neutral-200/80">
          <div className="max-w-4xl mx-auto">
            {/* Heading & Subtitle */}
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-2.5">
                Why Shop With HomeKit?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
                Quality finds. Affordable prices. Easy shopping. We're here to make every order simple and convenient.
              </p>
            </div>

            {/* Exactly 4 Premium Feature Cards in 2-Column Grid (Desktop & Mobile) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              {/* Card 1: Convenient Delivery */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-neutral-200/70 shadow-xs flex flex-col justify-start gap-3 transition-shadow hover:shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 tracking-tight mb-1">
                    Convenient Delivery
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-500 leading-relaxed">
                    Shop from home with clear shipping details at checkout.
                  </p>
                </div>
              </div>

              {/* Card 2: Cash on Delivery */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-neutral-200/70 shadow-xs flex flex-col justify-start gap-3 transition-shadow hover:shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                  <Banknote className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 tracking-tight mb-1">
                    Cash on Delivery
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-500 leading-relaxed">
                    Pay when your parcel arrives, where COD is available.
                  </p>
                </div>
              </div>

              {/* Card 3: Safe & Secure Checkout */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-neutral-200/70 shadow-xs flex flex-col justify-start gap-3 transition-shadow hover:shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 tracking-tight mb-1">
                    Safe & Secure Checkout
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-500 leading-relaxed">
                    Enjoy a protected checkout experience with secure payment handling.
                  </p>
                </div>
              </div>

              {/* Card 4: Dedicated Customer Support */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-neutral-200/70 shadow-xs flex flex-col justify-start gap-3 transition-shadow hover:shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                  <Headset className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 tracking-tight mb-1">
                    Dedicated Customer Support
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-500 leading-relaxed">
                    Questions about a product or order? We're here to help.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Contact Support Section (Directly below these 4 cards) */}
            <div className="mt-6 sm:mt-8 p-5 sm:p-6 md:p-7 rounded-xl sm:rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 tracking-tight mb-1">
                  Need Help Before Placing Your Order?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  Have a question? Our team is happy to assist you.
                </p>
              </div>
              <a
                href="https://wa.me/923292284120"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shrink-0 shadow-sm hover:shadow"
              >
                <span>Contact Support</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS SECTION ("Our Customers Love Us") */}
        <CustomerReviews className="mt-14 sm:mt-18" />

        {/* RELATED PRODUCTS SECTION (Exactly 4 related products) */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-20 pt-12 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
              <div>
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 block mb-1">
                  Complete Your Home
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Related Products
                </h2>
              </div>
              <span className="text-xs text-neutral-500 font-mono">
                Category: {product.category}
              </span>
            </div>

            {/* Exactly 4 Related Products in responsive 4-column grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((relProduct, idx) => (
                <ProductCard
                  key={`related-${relProduct.id}`}
                  product={relProduct}
                  onSelectProduct={(p) => {
                    if (onSelectProduct) {
                      onSelectProduct(p);
                    }
                  }}
                  index={idx}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };
