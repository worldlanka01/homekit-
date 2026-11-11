export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number; // Current selling price (used for checkout, cart, totalAmount)
  originalPrice?: number; // Cut/Original price before discount (price + 600)
  category: string;
  description: string;
  details: string[];
  images: string[];
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerOrder {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'Cash on Delivery';
  createdAt: string;
}
