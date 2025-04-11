/**
 * Product interface
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Order interface
 */
export interface Order {
  id: string;
  customer_id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Order item interface
 */
export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * Address interface
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

/**
 * Cart interface
 */
export interface Cart {
  items: CartItem[];
  total: number;
}

/**
 * Cart item interface
 */
export interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  image_url?: string;
}

/**
 * Inventory item interface
 */
export interface InventoryItem {
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  last_restock_date?: string;
  updated_at: string;
}
