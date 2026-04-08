import type {
  Banner,
  Category,
  Coupon,
  DashboardStats,
  Order,
  OrderItem,
  Product,
  ProductImage,
  Review,
} from '@/types';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
const DEFAULT_UPDATED_AT = '2024-03-01';

function createCategory(
  id: string,
  name: string,
  slug: string,
  description: string,
  imageUrl = PLACEHOLDER_IMG,
): Category {
  return {
    id,
    name,
    slug,
    description,
    image_url: imageUrl,
    parent_id: null,
    is_active: true,
  };
}

function createImage(productId: string, id: string, url: string, alt: string, position = 0): ProductImage {
  return { id, product_id: productId, url, alt, position };
}

function createProduct({
  id,
  title,
  slug,
  description,
  price,
  salePrice = null,
  brand,
  category,
  images,
  rating,
  reviewCount,
  stock,
  sku,
  featured,
  createdAt,
  updatedAt = DEFAULT_UPDATED_AT,
}: {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  brand: string;
  category: Category;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}): Product {
  return {
    id,
    title,
    slug,
    description,
    price,
    sale_price: salePrice,
    brand,
    category_id: category.id,
    category,
    images,
    rating,
    review_count: reviewCount,
    stock,
    sku,
    featured,
    is_active: true,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

function createBanner(id: string, title: string, subtitle: string, imageUrl: string, linkUrl: string, position: number): Banner {
  return {
    id,
    title,
    subtitle,
    image_url: imageUrl,
    link_url: linkUrl,
    position,
    is_active: true,
  };
}

function createReview({
  id,
  productId,
  userId,
  userName,
  rating,
  title,
  comment,
  createdAt,
}: {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}): Review {
  return {
    id,
    product_id: productId,
    user_id: userId,
    user_name: userName,
    rating,
    title,
    comment,
    is_verified: true,
    created_at: createdAt,
  };
}

function createCoupon({
  id,
  code,
  description,
  type,
  value,
  minOrderValue,
  maxUses,
  usedCount,
  isActive,
  expiresAt,
}: {
  id: string;
  code: string;
  description: string;
  type: Coupon['discount_type'];
  value: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
}): Coupon {
  return {
    id,
    code,
    description,
    discount_type: type,
    discount_value: value,
    min_order_value: minOrderValue,
    max_uses: maxUses,
    used_count: usedCount,
    is_active: isActive,
    expires_at: expiresAt,
  };
}

function createOrderItem(id: string, orderId: string, productId: string, quantity: number, price: number): OrderItem {
  return {
    id,
    order_id: orderId,
    product_id: productId,
    quantity,
    price,
    total: quantity * price,
  };
}

function createOrder({
  id,
  userId,
  status,
  subtotal,
  discount,
  shipping,
  total,
  couponCode,
  address,
  paymentMethod,
  paymentStatus,
  createdAt,
  updatedAt,
  items,
}: {
  id: string;
  userId: string;
  status: Order['status'];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  address: Order['shipping_address'];
  paymentMethod: string;
  paymentStatus: Order['payment_status'];
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}): Order {
  return {
    id,
    user_id: userId,
    status,
    subtotal,
    discount,
    shipping,
    total,
    coupon_code: couponCode,
    shipping_address: address,
    payment_method: paymentMethod,
    payment_status: paymentStatus,
    notes: '',
    created_at: createdAt,
    updated_at: updatedAt,
    items,
  };
}

export const mockCategories: Category[] = [
  createCategory('1', 'Electronics', 'electronics', 'Premium tech & gadgets', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80'),
  createCategory('2', 'Audio', 'audio', 'Immersive sound experience', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'),
  createCategory('3', 'Wearables', 'wearables', 'Smart accessories', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'),
  createCategory('4', 'Lifestyle', 'lifestyle', 'Curated essentials', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80'),
  createCategory('5', 'Home', 'home', 'Elevated living', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80'),
  createCategory('6', 'Accessories', 'accessories', 'Refined details', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80'),
];

const [
  electronicsCategory,
  audioCategory,
  wearablesCategory,
  lifestyleCategory,
  homeCategory,
  accessoriesCategory,
] = mockCategories;

export const mockProducts: Product[] = [
  createProduct({
    id: '1',
    title: 'Obsidian Pro Headphones',
    slug: 'obsidian-pro-headphones',
    description: 'Premium wireless headphones with active noise cancellation, spatial audio, and 40-hour battery life. Crafted with precision-machined aluminum and memory foam ear cushions for unparalleled comfort.',
    price: 449,
    salePrice: 379,
    brand: 'LUXE Audio',
    category: audioCategory,
    images: [
      createImage('1', '1', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'Obsidian Pro Headphones'),
      createImage('1', '1b', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', 'Side view', 1),
    ],
    rating: 4.8,
    reviewCount: 324,
    stock: 45,
    sku: 'LXA-OPH-001',
    featured: true,
    createdAt: '2024-01-15',
  }),
  createProduct({
    id: '2',
    title: 'Titan Smartwatch Ultra',
    slug: 'titan-smartwatch-ultra',
    description: 'Next-generation smartwatch with sapphire crystal display, titanium case, advanced health monitoring, and 5-day battery life. Water resistant to 100m.',
    price: 699,
    brand: 'LUXE Tech',
    category: wearablesCategory,
    images: [createImage('2', '2', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'Titan Smartwatch Ultra')],
    rating: 4.9,
    reviewCount: 186,
    stock: 22,
    sku: 'LXT-TSU-002',
    featured: true,
    createdAt: '2024-02-01',
  }),
  createProduct({
    id: '3',
    title: 'Aether Wireless Speaker',
    slug: 'aether-wireless-speaker',
    description: '360-degree omnidirectional sound with room-filling acoustics. Hand-finished ceramic housing with touch controls and 20-hour battery.',
    price: 299,
    salePrice: 249,
    brand: 'LUXE Audio',
    category: audioCategory,
    images: [createImage('3', '3', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', 'Aether Speaker')],
    rating: 4.7,
    reviewCount: 412,
    stock: 67,
    sku: 'LXA-AWS-003',
    featured: true,
    createdAt: '2024-01-20',
  }),
  createProduct({
    id: '4',
    title: 'Prism 4K Webcam',
    slug: 'prism-4k-webcam',
    description: 'Studio-quality 4K webcam with AI-powered auto-framing, low-light correction, and dual stereo microphones. USB-C plug and play.',
    price: 199,
    brand: 'LUXE Tech',
    category: electronicsCategory,
    images: [createImage('4', '4', 'https://images.unsplash.com/photo-1587825140708-dfaf18c4df54?w=800&q=80', 'Prism Webcam')],
    rating: 4.5,
    reviewCount: 89,
    stock: 120,
    sku: 'LXT-P4K-004',
    featured: false,
    createdAt: '2024-02-10',
  }),
  createProduct({
    id: '5',
    title: 'Nova Desk Lamp Pro',
    slug: 'nova-desk-lamp-pro',
    description: 'Architect-designed LED desk lamp with adjustable color temperature, wireless charging base, and ambient light sensor. Machined aluminum body.',
    price: 189,
    salePrice: 159,
    brand: 'LUXE Home',
    category: homeCategory,
    images: [createImage('5', '5', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'Nova Desk Lamp')],
    rating: 4.6,
    reviewCount: 201,
    stock: 34,
    sku: 'LXH-NDL-005',
    featured: false,
    createdAt: '2024-01-25',
  }),
  createProduct({
    id: '6',
    title: 'Meridian Backpack',
    slug: 'meridian-backpack',
    description: 'Water-resistant technical backpack with padded laptop compartment, hidden pockets, and magnetic closures. Italian leather accents.',
    price: 249,
    brand: 'LUXE Life',
    category: lifestyleCategory,
    images: [createImage('6', '6', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Meridian Backpack')],
    rating: 4.8,
    reviewCount: 156,
    stock: 18,
    sku: 'LXL-MB-006',
    featured: true,
    createdAt: '2024-02-05',
  }),
  createProduct({
    id: '7',
    title: 'Carbon Fiber Wallet',
    slug: 'carbon-fiber-wallet',
    description: 'Ultra-slim RFID-blocking wallet crafted from aerospace-grade carbon fiber. Holds 8 cards with quick-access pull tab.',
    price: 129,
    brand: 'LUXE Life',
    category: accessoriesCategory,
    images: [createImage('7', '7', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80', 'Carbon Wallet')],
    rating: 4.4,
    reviewCount: 278,
    stock: 89,
    sku: 'LXL-CFW-007',
    featured: false,
    createdAt: '2024-01-18',
  }),
  createProduct({
    id: '8',
    title: 'Eclipse Sunglasses',
    slug: 'eclipse-sunglasses',
    description: 'Polarized titanium sunglasses with anti-reflective coating and UV400 protection. Japanese engineering meets Italian design.',
    price: 329,
    salePrice: 279,
    brand: 'LUXE Life',
    category: accessoriesCategory,
    images: [createImage('8', '8', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', 'Eclipse Sunglasses')],
    rating: 4.7,
    reviewCount: 93,
    stock: 42,
    sku: 'LXL-ES-008',
    featured: false,
    createdAt: '2024-02-15',
  }),
];

export const mockBanners: Banner[] = [
  createBanner('1', 'The Art of Sound', 'Experience audio perfection', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=80', '/products/obsidian-pro-headphones', 0),
  createBanner('2', 'Precision Timepiece', 'Where technology meets elegance', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80', '/products/titan-smartwatch-ultra', 1),
];

export const mockReviews: Review[] = [
  createReview({
    id: '1',
    productId: '1',
    userId: 'u1',
    userName: 'Alexandra M.',
    rating: 5,
    title: 'Absolutely stunning',
    comment: "The sound quality is beyond anything I've experienced. Build quality is impeccable.",
    createdAt: '2024-02-20',
  }),
  createReview({
    id: '2',
    productId: '1',
    userId: 'u2',
    userName: 'Marcus T.',
    rating: 5,
    title: 'Worth every penny',
    comment: 'Best noise cancellation on the market. The comfort is unreal for long sessions.',
    createdAt: '2024-02-18',
  }),
  createReview({
    id: '3',
    productId: '2',
    userId: 'u3',
    userName: 'Sophie L.',
    rating: 5,
    title: 'Game changer',
    comment: 'The health monitoring features are incredibly accurate. Beautiful design.',
    createdAt: '2024-02-25',
  }),
  createReview({
    id: '4',
    productId: '3',
    userId: 'u4',
    userName: 'Daniel K.',
    rating: 4,
    title: 'Impressive sound',
    comment: 'Room-filling audio that punches way above its weight. Love the ceramic finish.',
    createdAt: '2024-02-22',
  }),
];

export const mockCoupons: Coupon[] = [
  createCoupon({
    id: '1',
    code: 'WELCOME10',
    description: '10% off your first order',
    type: 'percentage',
    value: 10,
    minOrderValue: 50,
    maxUses: 1000,
    usedCount: 342,
    isActive: true,
    expiresAt: '2025-12-31',
  }),
  createCoupon({
    id: '2',
    code: 'PREMIUM50',
    description: '$50 off orders over $300',
    type: 'fixed',
    value: 50,
    minOrderValue: 300,
    maxUses: 500,
    usedCount: 87,
    isActive: true,
    expiresAt: '2025-06-30',
  }),
  createCoupon({
    id: '3',
    code: 'SUMMER25',
    description: '25% off summer collection',
    type: 'percentage',
    value: 25,
    minOrderValue: 100,
    maxUses: 200,
    usedCount: 156,
    isActive: false,
    expiresAt: '2024-09-01',
  }),
];

export const mockOrders: Order[] = [
  createOrder({
    id: 'ORD-001',
    userId: 'u1',
    status: 'delivered',
    subtotal: 449,
    discount: 44.9,
    shipping: 0,
    total: 404.1,
    couponCode: 'WELCOME10',
    address: {
      street: 'Rua Augusta',
      number: '1200',
      neighborhood: 'Consolacao',
      city: 'Sao Paulo',
      state: 'SP',
      zip: '01304-001',
      country: 'BR',
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
    items: [createOrderItem('oi1', 'ORD-001', '1', 1, 449)],
  }),
  createOrder({
    id: 'ORD-002',
    userId: 'u2',
    status: 'shipped',
    subtotal: 699,
    discount: 0,
    shipping: 0,
    total: 699,
    couponCode: null,
    address: {
      street: 'Av. Paulista',
      number: '900',
      neighborhood: 'Bela Vista',
      city: 'Sao Paulo',
      state: 'SP',
      zip: '01310-100',
      country: 'BR',
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: '2024-02-18T14:20:00Z',
    updatedAt: '2024-02-22T09:00:00Z',
    items: [createOrderItem('oi2', 'ORD-002', '2', 1, 699)],
  }),
  createOrder({
    id: 'ORD-003',
    userId: 'u3',
    status: 'processing',
    subtotal: 548,
    discount: 50,
    shipping: 15,
    total: 513,
    couponCode: 'PREMIUM50',
    address: {
      street: 'Rua Oscar Freire',
      number: '300',
      neighborhood: 'Jardins',
      city: 'Sao Paulo',
      state: 'SP',
      zip: '01426-000',
      country: 'BR',
    },
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    createdAt: '2024-03-01T09:15:00Z',
    updatedAt: '2024-03-01T09:15:00Z',
    items: [createOrderItem('oi3', 'ORD-003', '3', 1, 299), createOrderItem('oi4', 'ORD-003', '6', 1, 249)],
  }),
  createOrder({
    id: 'ORD-004',
    userId: 'u4',
    status: 'pending',
    subtotal: 329,
    discount: 0,
    shipping: 12,
    total: 341,
    couponCode: null,
    address: {
      street: 'Rua Bela Cintra',
      number: '560',
      neighborhood: 'Consolacao',
      city: 'Sao Paulo',
      state: 'SP',
      zip: '01415-000',
      country: 'BR',
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'pending',
    createdAt: '2024-03-05T16:45:00Z',
    updatedAt: '2024-03-05T16:45:00Z',
    items: [createOrderItem('oi5', 'ORD-004', '8', 1, 329)],
  }),
];

export const mockDashboardStats: DashboardStats = {
  total_revenue: 48720,
  total_orders: 87,
  avg_ticket: 560.23,
  total_customers: 214,
  low_stock_count: 3,
  recent_orders: mockOrders,
  top_products: [
    { product: mockProducts[0], total_sold: 324 },
    { product: mockProducts[2], total_sold: 276 },
    { product: mockProducts[1], total_sold: 186 },
    { product: mockProducts[5], total_sold: 156 },
  ],
  revenue_by_day: [
    { date: '2024-02-26', revenue: 1240 },
    { date: '2024-02-27', revenue: 2100 },
    { date: '2024-02-28', revenue: 980 },
    { date: '2024-02-29', revenue: 3200 },
    { date: '2024-03-01', revenue: 1850 },
    { date: '2024-03-02', revenue: 2640 },
    { date: '2024-03-03', revenue: 1920 },
    { date: '2024-03-04', revenue: 3100 },
    { date: '2024-03-05', revenue: 2780 },
    { date: '2024-03-06', revenue: 1560 },
    { date: '2024-03-07', revenue: 4200 },
    { date: '2024-03-08', revenue: 3450 },
    { date: '2024-03-09', revenue: 2890 },
    { date: '2024-03-10', revenue: 1700 },
  ],
};
