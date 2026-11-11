import React from 'react';
import { CartItem, Product } from '../types/product';
import { ProductImage } from './ProductImage';
import { FreeDeliveryBadge } from './FreeDeliveryBadge';
import { DiscountBadge } from './DiscountBadge';
import { getProductPricing } from '../utils/pricing';
import { X, Trash2, Plus, Minus, ArrowRight, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onSelectProduct: (product: Product) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Cart Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Shopping Cart
              </h2>
              <span className="text-xs text-neutral-500 font-mono">
                ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="text-center py-16 text-neutral-500">
                <p className="text-sm font-medium mb-4">Your cart is currently empty.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="pt-6 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div 
                    onClick={() => {
                      onSelectProduct(item.product);
                      onClose();
                    }}
                    className="w-20 h-20 bg-neutral-100 shrink-0 border border-neutral-200 cursor-pointer overflow-hidden"
                  >
                    <ProductImage
                      productId={item.product.id}
                      src={item.product.images[0] || `/products/${item.product.id}/image-1.webp`}
                      alt={item.product.name}
                      category={item.product.category}
                      aspectClassName="aspect-square"
                    />
                  </div>

                  {/* Item info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 
                          onClick={() => {
                            onSelectProduct(item.product);
                            onClose();
                          }}
                          className="text-xs sm:text-sm font-medium text-neutral-900 line-clamp-2 cursor-pointer hover:underline"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-xs font-semibold text-neutral-900 font-mono">
                          PKR {item.product.price.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-neutral-400 line-through font-mono">
                          PKR {(item.product.price + 600).toLocaleString()}
                        </span>
                        <DiscountBadge 
                          percentage={Math.round((600 / (item.product.price + 600)) * 100)} 
                          size="sm" 
                          variant="subtle" 
                        />
                        <FreeDeliveryBadge size="sm" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 tabular-nums">
                          PKR {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-between mb-1.5 text-sm">
                <span className="text-neutral-600 font-medium">Subtotal</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2 text-xs text-emerald-700">
                <span className="font-medium">Total Discount Savings</span>
                <span className="font-semibold tabular-nums">
                  - PKR {(600 * items.reduce((s, i) => s + i.quantity, 0)).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nationwide Delivery</span>
                </span>
                <span className="font-semibold text-emerald-700 uppercase tracking-wide">
                  FREE
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mb-4">
                Cash on delivery available. Zero shipping charges on all orders.
              </p>
              <button
                onClick={onCheckout}
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1ca64f] text-white text-sm sm:text-base font-bold tracking-wide rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Cart to Order</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
