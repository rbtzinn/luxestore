import type { Product, Category, Banner, Review, Order, Coupon, DashboardStats } from '@/types';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';

export const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Premium tech & gadgets', image_url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80', parent_id: null, is_active: true },
  { id: '2', name: 'Audio', slug: 'audio', description: 'Immersive sound experience', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', parent_id: null, is_active: true },
  { id: '3', name: 'Wearables', slug: 'wearables', description: 'Smart accessories', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', parent_id: null, is_active: true },
  { id: '4', name: 'Lifestyle', slug: 'lifestyle', description: 'Curated essentials', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80', parent_id: null, is_active: true },
  { id: '5', name: 'Home', slug: 'home', description: 'Elevated living', image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80', parent_id: null, is_active: true },
  { id: '6', name: 'Accessories', slug: 'accessories', description: 'Refined details', image_url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80', parent_id: null, is_active: true },
];

export const mockProducts: Product[] = [
  {
    id: '1', title: 'Obsidian Pro Headphones', slug: 'obsidian-pro-headphones', description: 'Premium wireless headphones with active noise cancellation, spatial audio, and 40-hour battery life. Crafted with precision-machined aluminum and memory foam ear cushions for unparalleled comfort.', price: 449.00, sale_price: 379.00, brand: 'LUXE Audio', category_id: '2', category: mockCategories[1], images: [{ id: '1', product_id: '1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', alt: 'Obsidian Pro Headphones', position: 0 }, { id: '1b', product_id: '1', url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', alt: 'Side view', position: 1 }], rating: 4.8, review_count: 324, stock: 45, sku: 'LXA-OPH-001', featured: true, is_active: true, created_at: '2024-01-15', updated_at: '2024-03-01',
  },
  {
    id: '2', title: 'Titan Smartwatch Ultra', slug: 'titan-smartwatch-ultra', description: 'Next-generation smartwatch with sapphire crystal display, titanium case, advanced health monitoring, and 5-day battery life. Water resistant to 100m.', price: 699.00, sale_price: null, brand: 'LUXE Tech', category_id: '3', category: mockCategories[2], images: [{ id: '2', product_id: '2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: 'Titan Smartwatch Ultra', position: 0 }], rating: 4.9, review_count: 186, stock: 22, sku: 'LXT-TSU-002', featured: true, is_active: true, created_at: '2024-02-01', updated_at: '2024-03-01',
  },
  {
    id: '3', title: 'Aether Wireless Speaker', slug: 'aether-wireless-speaker', description: '360° omnidirectional sound with room-filling acoustics. Hand-finished ceramic housing with touch controls and 20-hour battery.', price: 299.00, sale_price: 249.00, brand: 'LUXE Audio', category_id: '2', category: mockCategories[1], images: [{ id: '3', product_id: '3', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', alt: 'Aether Speaker', position: 0 }], rating: 4.7, review_count: 412, stock: 67, sku: 'LXA-AWS-003', featured: true, is_active: true, created_at: '2024-01-20', updated_at: '2024-03-01',
  },
  {
    id: '4', title: 'Prism 4K Webcam', slug: 'prism-4k-webcam', description: 'Studio-quality 4K webcam with AI-powered auto-framing, low-light correction, and dual stereo microphones. USB-C plug and play.', price: 199.00, sale_price: null, brand: 'LUXE Tech', category_id: '1', category: mockCategories[0], images: [{ id: '4', product_id: '4', url: 'https://images.unsplash.com/photo-1587825140708-dfaf18c4df54?w=800&q=80', alt: 'Prism Webcam', position: 0 }], rating: 4.5, review_count: 89, stock: 120, sku: 'LXT-P4K-004', featured: false, is_active: true, created_at: '2024-02-10', updated_at: '2024-03-01',
  },
  {
    id: '5', title: 'Nova Desk Lamp Pro', slug: 'nova-desk-lamp-pro', description: 'Architect-designed LED desk lamp with adjustable color temperature, wireless charging base, and ambient light sensor. Machined aluminum body.', price: 189.00, sale_price: 159.00, brand: 'LUXE Home', category_id: '5', category: mockCategories[4], images: [{ id: '5', product_id: '5', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', alt: 'Nova Desk Lamp', position: 0 }], rating: 4.6, review_count: 201, stock: 34, sku: 'LXH-NDL-005', featured: false, is_active: true, created_at: '2024-01-25', updated_at: '2024-03-01',
  },
  {
    id: '6', title: 'Meridian Backpack', slug: 'meridian-backpack', description: 'Water-resistant technical backpack with padded laptop compartment, hidden pockets, and magnetic closures. Italian leather accents.', price: 249.00, sale_price: null, brand: 'LUXE Life', category_id: '4', category: mockCategories[3], images: [{ id: '6', product_id: '6', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', alt: 'Meridian Backpack', position: 0 }], rating: 4.8, review_count: 156, stock: 18, sku: 'LXL-MB-006', featured: true, is_active: true, created_at: '2024-02-05', updated_at: '2024-03-01',
  },
  {
    id: '7', title: 'Carbon Fiber Wallet', slug: 'carbon-fiber-wallet', description: 'Ultra-slim RFID-blocking wallet crafted from aerospace-grade carbon fiber. Holds 8 cards with quick-access pull tab.', price: 129.00, sale_price: null, brand: 'LUXE Life', category_id: '6', category: mockCategories[5], images: [{ id: '7', product_id: '7', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80', alt: 'Carbon Wallet', position: 0 }], rating: 4.4, review_count: 278, stock: 89, sku: 'LXL-CFW-007', featured: false, is_active: true, created_at: '2024-01-18', updated_at: '2024-03-01',
  },
  {
    id: '8', title: 'Eclipse Sunglasses', slug: 'eclipse-sunglasses', description: 'Polarized titanium sunglasses with anti-reflective coating and UV400 protection. Japanese engineering meets Italian design.', price: 329.00, sale_price: 279.00, brand: 'LUXE Life', category_id: '6', category: mockCategories[5], images: [{ id: '8', product_id: '8', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', alt: 'Eclipse Sunglasses', position: 0 }], rating: 4.7, review_count: 93, stock: 42, sku: 'LXL-ES-008', featured: false, is_active: true, created_at: '2024-02-15', updated_at: '2024-03-01',
  },
];

export const mockBanners: Banner[] = [
  { id: '1', title: 'The Art of Sound', subtitle: 'Experience audio perfection', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=80', link_url: '/products/obsidian-pro-headphones', position: 0, is_active: true },
  { id: '2', title: 'Precision Timepiece', subtitle: 'Where technology meets elegance', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80', link_url: '/products/titan-smartwatch-ultra', position: 1, is_active: true },
];

export const mockReviews: Review[] = [
  { id: '1', product_id: '1', user_id: 'u1', user_name: 'Alexandra M.', rating: 5, title: 'Absolutely stunning', comment: 'The sound quality is beyond anything I\'ve experienced. Build quality is impeccable.', is_verified: true, created_at: '2024-02-20' },
  { id: '2', product_id: '1', user_id: 'u2', user_name: 'Marcus T.', rating: 5, title: 'Worth every penny', comment: 'Best noise cancellation on the market. The comfort is unreal for long sessions.', is_verified: true, created_at: '2024-02-18' },
  { id: '3', product_id: '2', user_id: 'u3', user_name: 'Sophie L.', rating: 5, title: 'Game changer', comment: 'The health monitoring features are incredibly accurate. Beautiful design.', is_verified: true, created_at: '2024-02-25' },
  { id: '4', product_id: '3', user_id: 'u4', user_name: 'Daniel K.', rating: 4, title: 'Impressive sound', comment: 'Room-filling audio that punches way above its weight. Love the ceramic finish.', is_verified: true, created_at: '2024-02-22' },
];

export const mockCoupons: Coupon[] = [
  { id: '1', code: 'WELCOME10', description: '10% off your first order', discount_type: 'percentage', discount_value: 10, min_order_value: 50, max_uses: 1000, used_count: 342, is_active: true, expires_at: '2025-12-31' },
  { id: '2', code: 'PREMIUM50', description: '$50 off orders over $300', discount_type: 'fixed', discount_value: 50, min_order_value: 300, max_uses: 500, used_count: 87, is_active: true, expires_at: '2025-06-30' },
  { id: '3', code: 'SUMMER25', description: '25% off summer collection', discount_type: 'percentage', discount_value: 25, min_order_value: 100, max_uses: 200, used_count: 156, is_active: false, expires_at: '2024-09-01' },
];

export const mockOrders: Order[] = [
  { id: 'ORD-001', user_id: 'u1', status: 'delivered', subtotal: 449, discount: 44.9, shipping: 0, total: 404.10, coupon_code: 'WELCOME10', shipping_address: { street: 'Rua Augusta', number: '1200', neighborhood: 'Consolação', city: 'São Paulo', state: 'SP', zip: '01304-001', country: 'BR' }, payment_method: 'credit_card', payment_status: 'paid', notes: '', created_at: '2024-02-15T10:30:00Z', updated_at: '2024-02-20T14:00:00Z', items: [{ id: 'oi1', order_id: 'ORD-001', product_id: '1', quantity: 1, price: 449, total: 449 }] },
  { id: 'ORD-002', user_id: 'u2', status: 'shipped', subtotal: 699, discount: 0, shipping: 0, total: 699, coupon_code: null, shipping_address: { street: 'Av. Paulista', number: '900', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP', zip: '01310-100', country: 'BR' }, payment_method: 'credit_card', payment_status: 'paid', notes: '', created_at: '2024-02-18T14:20:00Z', updated_at: '2024-02-22T09:00:00Z', items: [{ id: 'oi2', order_id: 'ORD-002', product_id: '2', quantity: 1, price: 699, total: 699 }] },
  { id: 'ORD-003', user_id: 'u3', status: 'processing', subtotal: 548, discount: 50, shipping: 15, total: 513, coupon_code: 'PREMIUM50', shipping_address: { street: 'Rua Oscar Freire', number: '300', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', zip: '01426-000', country: 'BR' }, payment_method: 'pix', payment_status: 'paid', notes: '', created_at: '2024-03-01T09:15:00Z', updated_at: '2024-03-01T09:15:00Z', items: [{ id: 'oi3', order_id: 'ORD-003', product_id: '3', quantity: 1, price: 299, total: 299 }, { id: 'oi4', order_id: 'ORD-003', product_id: '6', quantity: 1, price: 249, total: 249 }] },
  { id: 'ORD-004', user_id: 'u4', status: 'pending', subtotal: 329, discount: 0, shipping: 12, total: 341, coupon_code: null, shipping_address: { street: 'Rua Bela Cintra', number: '560', neighborhood: 'Consolação', city: 'São Paulo', state: 'SP', zip: '01415-000', country: 'BR' }, payment_method: 'credit_card', payment_status: 'pending', notes: '', created_at: '2024-03-05T16:45:00Z', updated_at: '2024-03-05T16:45:00Z', items: [{ id: 'oi5', order_id: 'ORD-004', product_id: '8', quantity: 1, price: 329, total: 329 }] },
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
