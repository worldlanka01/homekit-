/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, CartItem, CustomerOrder } from './types/product';
import { 
  ALL_PRODUCTS, 
  PAGE_1_PRODUCTS, 
  PAGE_2_PRODUCTS, 
  PAGE_3_PRODUCTS 
} from './data/products';
import { 
  resolveProductFromLocation, 
  syncDocumentTitle, 
  getProductHref 
} from './utils/productRouting';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Pagination } from './components/Pagination';
import { ProductDetail } from './components/ProductDetail';
import { ShopWithConfidence } from './components/ShopWithConfidence';
import { CustomerReviews } from './components/CustomerReviews';
import { AboutUs } from './components/AboutUs';
import { SocialMediaSection } from './components/SocialMediaSection';
import { WhatsAppSupportBubble } from './components/WhatsAppSupportBubble';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { ImageManagerModal } from './components/ImageManagerModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#page-')) {
        const pageNum = parseInt(hash.replace('#page-', ''), 10);
        if (pageNum >= 1 && pageNum <= 3) return pageNum;
      }
    }
    return 1;
  });

  // Strict initial product resolution directly from URL to prevent flash of homepage on refresh
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const initialProduct = resolveProductFromLocation();
    if (initialProduct) {
      syncDocumentTitle(initialProduct);
    }
    return initialProduct;
  });

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('homekit_cart') || localStorage.getItem('luxemart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [whatsAppModalData, setWhatsAppModalData] = useState<{ product: Product; quantity: number } | null>(null);
  const [imageModalProduct, setImageModalProduct] = useState<Product | null>(null);
  const [, setForceUpdate] = useState<number>(0);

  // Persistent reference to save collection scroll position
  const collectionScrollPosRef = useRef<number>(0);
  const shouldRestoreScrollRef = useRef<boolean>(false);
  const selectedProductRef = useRef<Product | null>(null);

  // Keep ref synchronized with state for event listeners
  useEffect(() => {
    selectedProductRef.current = selectedProduct;
  }, [selectedProduct]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('homekit_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [cartItems]);

  // Restore collection scroll position reliably upon returning to collection
  useEffect(() => {
    if (!selectedProduct && shouldRestoreScrollRef.current) {
      shouldRestoreScrollRef.current = false;
      const targetY = collectionScrollPosRef.current;

      const performScroll = () => {
        window.scrollTo({
          top: targetY,
          behavior: 'instant' as ScrollBehavior
        });
      };

      // Immediate attempt
      performScroll();

      // Multi-stage restoration to guarantee accurate landing after layout reflow
      const raf = requestAnimationFrame(() => {
        performScroll();
      });
      const t1 = setTimeout(performScroll, 50);
      const t2 = setTimeout(performScroll, 160);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [selectedProduct]);

  // Strict bi-directional URL routing: handles hashchange, popstate (browser back/forward), and direct URL params
  useEffect(() => {
    const handleLocationChange = () => {
      const product = resolveProductFromLocation();

      if (product) {
        // If transitioning from collection, capture current scroll offset
        if (!selectedProductRef.current) {
          collectionScrollPosRef.current = window.scrollY;
        }
        setSelectedProduct(product);
        syncDocumentTitle(product);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        return;
      }

      // Check pagination hash (e.g. #page-2)
      const hash = window.location.hash || '';
      if (hash.startsWith('#page-')) {
        const pageNum = parseInt(hash.replace('#page-', ''), 10);
        if (pageNum >= 1 && pageNum <= 3) {
          setCurrentPage(pageNum);
        }
      }

      // If returning to collection from product view
      if (selectedProductRef.current) {
        setSelectedProduct(null);
        syncDocumentTitle(null);
        // Only restore scroll if not explicitly jumping to an anchor on the page
        if (!hash.includes('about-us') && !hash.includes('social-media') && !hash.includes('shop-with-confidence')) {
          shouldRestoreScrollRef.current = true;
        }
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Compute products according to strict prompt specification:
  // Page 1: Products 1–30
  // Page 2: Products 31–60
  // Page 3: Products 61–89
  const currentProducts = useMemo(() => {
    if (activeCategory) {
      return ALL_PRODUCTS.filter((p) => p.category === activeCategory);
    }
    if (currentPage === 1) return PAGE_1_PRODUCTS;
    if (currentPage === 2) return PAGE_2_PRODUCTS;
    return PAGE_3_PRODUCTS;
  }, [currentPage, activeCategory]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const handleSelectProduct = (product: Product) => {
    if (!product) return;
    // Save the exact collection scroll position only when coming from the collection view
    if (!selectedProduct) {
      collectionScrollPosRef.current = window.scrollY;
    }

    setSelectedProduct(product);
    syncDocumentTitle(product);
    try {
      const targetHash = getProductHref(product);
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    } catch {
      // Ignore if iframe restricts hash modification
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCollection = () => {
    // Flag that we must restore the exact saved scroll position
    shouldRestoreScrollRef.current = true;
    setSelectedProduct(null);
    syncDocumentTitle(null);

    try {
      window.location.hash = `page-${currentPage}`;
    } catch {
      // Ignore
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActiveCategory('');
    setSelectedProduct(null);
    syncDocumentTitle(null);
    collectionScrollPosRef.current = 0;
    shouldRestoreScrollRef.current = false;
    try {
      window.location.hash = `page-${page}`;
    } catch {
      // Ignore
    }
    const element = document.getElementById('collection-header');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderSuccess = (_order: CustomerOrder) => {
    setCartItems([]);
  };

  const handleImageUpdated = (_productId: string) => {
    setForceUpdate((v) => v + 1);
  };

  return (
    <div className="min-h-screen bg-transparent text-neutral-900 flex flex-col font-sans homekit-ambient-canvas relative">
      {/* Top Navigation */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onHomeClick={() => {
          setSelectedProduct(null);
          setActiveCategory('');
          try {
            window.location.hash = '';
          } catch {
            // Ignore
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(category) => {
          setActiveCategory(category);
          setSelectedProduct(null);
          const element = document.getElementById('collection-header');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        onSelectProduct={handleSelectProduct}
      />

      <main className="flex-1">
        {selectedProduct ? (
          /* SECTION 8: INDIVIDUAL PRODUCT DETAIL PAGE */
          <ProductDetail
            key={selectedProduct.id}
            product={selectedProduct}
            onBack={handleBackToCollection}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onOrderNow={(product, quantity) => setWhatsAppModalData({ product, quantity })}
            onOpenImageUpload={(product) => setImageModalProduct(product)}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
          <>
            {/* SECTION 5: HERO BANNER (completely independent) */}
            <Hero
              onExploreClick={() => {
                const element = document.getElementById('collection-header');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />

            {/* SECTION 6: PRODUCT GRID */}
            <ProductGrid
              products={currentProducts}
              onSelectProduct={handleSelectProduct}
              activeCategory={activeCategory}
              onClearCategory={() => setActiveCategory('')}
            />

            {/* SECTION 7: PAGINATION (1 | 2 | 3) */}
            {!activeCategory && (
              <Pagination
                currentPage={currentPage}
                totalPages={3}
                onPageChange={handlePageChange}
              />
            )}

            {/* SECTION 8: SHOP WITH CONFIDENCE */}
            <ShopWithConfidence />

            {/* SECTION 9: CUSTOMER REVIEWS */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 my-10 sm:my-14">
              <CustomerReviews />
            </div>

            {/* SECTION 10: ABOUT US */}
            <AboutUs />
          </>
        )}

        {/* SECTION 10: STAY CONNECTED WITH HOMEKIT (Dedicated Social Media Section) */}
        <SocialMediaSection />
      </main>

      {/* SECTION 11: FOOTER */}
      <Footer />

      {/* Floating 24/7 WhatsApp Support Bubble */}
      <WhatsAppSupportBubble />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onSelectProduct={(product) => {
          handleSelectProduct(product);
          setIsCartOpen(false);
        }}
      />

      {/* WhatsApp Order Modal */}
      <WhatsAppOrderModal
        isOpen={Boolean(whatsAppModalData)}
        onClose={() => setWhatsAppModalData(null)}
        product={whatsAppModalData?.product || null}
        initialQuantity={whatsAppModalData?.quantity || 1}
      />

      {/* Cash on Delivery Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Product Image Manager Modal (strictly per-product isolated) */}
      <ImageManagerModal
        product={imageModalProduct}
        isOpen={Boolean(imageModalProduct)}
        onClose={() => setImageModalProduct(null)}
        onImageUpdated={handleImageUpdated}
      />
    </div>
  );
}
