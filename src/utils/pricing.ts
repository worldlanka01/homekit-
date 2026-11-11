import { Product } from '../types/product';

export interface ProductPricing {
  sellingPrice: number;
  originalPrice: number;
  discountAmount: number;
  discountPercentage: number;
  formattedSellingPrice: string;
  formattedOriginalPrice: string;
}

/**
 * Calculates the product pricing according to the strict store pricing rules:
 * 1. Current selling price remains unchanged as the final discounted price (used in checkout/cart).
 * 2. Original cut price is current selling price + exactly Rs. 600.
 * 3. Discount percentage is individually calculated: ((Original - Selling) / Original) * 100.
 * 4. Idempotent: Never compounds or adds Rs. 600 multiple times.
 */
export function getProductPricing(product: { price: number; originalPrice?: number }): ProductPricing {
  const sellingPrice = product.price;
  const originalPrice = product.originalPrice ?? (sellingPrice + 600);
  const discountAmount = originalPrice - sellingPrice;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  return {
    sellingPrice,
    originalPrice,
    discountAmount,
    discountPercentage,
    formattedSellingPrice: `PKR ${sellingPrice.toLocaleString()}`,
    formattedOriginalPrice: `PKR ${originalPrice.toLocaleString()}`
  };
}
