export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  brand: string;
  category_id: string;
  category?: Category;
  images: ProductImage[];
  rating: number;
  review_count: number;
  stock: number;
  sku: string;
  featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  position: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon_code: string | null;
  shipping_address: Address;
  payment_method: string;
  payment_status: PaymentStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  position: number;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: 'admin' | 'staff' | 'customer';
  created_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  avg_ticket: number;
  total_customers: number;
  low_stock_count: number;
  recent_orders: Order[];
  top_products: { product: Product; total_sold: number }[];
  revenue_by_day: { date: string; revenue: number }[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface SyncLog {
  id: string;
  source: string;
  status: 'success' | 'error' | 'partial';
  products_synced: number;
  errors: string[];
  created_at: string;
}
