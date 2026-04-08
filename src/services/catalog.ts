import { mockCategories, mockProducts, mockReviews } from '@/data/mockData';
import type { Category, Product, ProductImage, Review } from '@/types';
import { localizeCategories, localizeProducts, localizeReviews } from '@/lib/dynamicTranslations';
import { normalizeLanguage } from '@/lib/locale';

const API_BASE_URL = (import.meta.env.VITE_PRODUCTS_API_URL || 'https://dummyjson.com').replace(/\/$/, '');
const PRODUCTS_LIMIT = 194;
type CatalogPayload = { categories: Category[]; products: Product[] };

type DummyProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  sku?: string;
  thumbnail?: string;
  images?: string[];
  reviews?: Array<{
    rating?: number;
    reviewerName?: string;
    comment?: string;
    date?: string;
  }>;
};

type DummyProductsResponse = {
  products: DummyProduct[];
};

type DummyCategory =
  | string
  | {
      slug?: string;
      name?: string;
      url?: string;
    };

let catalogPayloadPromise: Promise<CatalogPayload> | null = null;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function prettifyCategoryName(value: string) {
  return value
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function createCategoryImage(slug: string, products: DummyProduct[]) {
  const productWithImage = products.find((item) => item.category === slug && (item.thumbnail || item.images?.[0]));
  return productWithImage?.thumbnail || productWithImage?.images?.[0] || null;
}

function mapCategories(rawCategories: DummyCategory[], products: DummyProduct[]): Category[] {
  const mapped = rawCategories.map((entry, index) => {
    const slug = typeof entry === 'string' ? entry : entry.slug || slugify(entry.name || `category-${index + 1}`);
    const name = typeof entry === 'string' ? prettifyCategoryName(entry) : entry.name || prettifyCategoryName(slug);

    return {
      id: slug,
      name,
      slug,
      description: `Explore ${name.toLowerCase()} products`,
      image_url: createCategoryImage(slug, products),
      parent_id: null,
      is_active: true,
    } satisfies Category;
  });

  return mapped.length ? mapped : mockCategories;
}

function mapImages(product: DummyProduct): ProductImage[] {
  const imageUrls = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : [];

  return imageUrls.map((url, index) => ({
    id: `${product.id}-${index}`,
    product_id: String(product.id),
    url,
    alt: product.title,
    position: index,
  }));
}

function mapProduct(product: DummyProduct, categories: Category[]): Product {
  const category = categories.find((item) => item.slug === product.category);
  const discountValue = product.discountPercentage ?? 0;
  const salePrice = discountValue > 0 ? Number((product.price * (1 - discountValue / 100)).toFixed(2)) : null;
  const createdAt = new Date(Date.now() - Number(product.id) * 86400000).toISOString();

  return {
    id: String(product.id),
    title: product.title,
    slug: `${slugify(product.title)}-${product.id}`,
    description: product.description,
    price: Number(product.price ?? 0),
    sale_price: salePrice,
    brand: product.brand || 'Generic Brand',
    category_id: category?.id || product.category,
    category,
    images: mapImages(product),
    rating: Number(product.rating ?? 0),
    review_count: product.reviews?.length ?? Math.max(1, Math.round((product.rating ?? 4) * 8)),
    stock: Number(product.stock ?? 0),
    sku: product.sku || `SKU-${product.id}`,
    featured: Number(product.rating ?? 0) >= 4.5,
    is_active: true,
    created_at: createdAt,
    updated_at: createdAt,
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar ${path}`);
  }
  return response.json() as Promise<T>;
}

async function fetchCatalogPayload() {
  const [productsResponse, rawCategories] = await Promise.all([
    fetchJson<DummyProductsResponse>(`/products?limit=${PRODUCTS_LIMIT}&skip=0`),
    fetchJson<DummyCategory[]>(`/products/categories`),
  ]);

  const categories = mapCategories(rawCategories, productsResponse.products || []);
  const products = (productsResponse.products || []).map((item) => mapProduct(item, categories));

  return { categories, products };
}

function getCatalogPayload() {
  if (!catalogPayloadPromise) {
    catalogPayloadPromise = fetchCatalogPayload().catch((error) => {
      catalogPayloadPromise = null;
      throw error;
    });
  }

  return catalogPayloadPromise;
}

async function localizeProductsWithCategories(products: Product[], categories: Category[], language: string) {
  const localizedCategories = await localizeCategories(categories, language);
  const localizedProducts = await localizeProducts(products, language);

  return localizedProducts.map((product) => ({
    ...product,
    category: localizedCategories.find((item) => item.id === product.category_id) || product.category,
  }));
}

export async function listCategories(language = 'pt-BR'): Promise<Category[]> {
  const targetLanguage = normalizeLanguage(language);

  try {
    const { categories } = await getCatalogPayload();
    return localizeCategories(categories, targetLanguage);
  } catch {
    return localizeCategories(mockCategories, targetLanguage);
  }
}

export async function listProducts(language = 'pt-BR'): Promise<Product[]> {
  const targetLanguage = normalizeLanguage(language);

  try {
    const { categories, products } = await getCatalogPayload();
    return localizeProductsWithCategories(products, categories, targetLanguage);
  } catch {
    return localizeProductsWithCategories(mockProducts, mockCategories, targetLanguage);
  }
}

export async function getProductBySlug(slug: string, language = 'pt-BR'): Promise<Product | null> {
  const products = await listProducts(language);
  return products.find((item) => item.slug === slug) ?? null;
}

export async function listReviews(productId: string, language = 'pt-BR'): Promise<Review[]> {
  const targetLanguage = normalizeLanguage(language);

  try {
    const product = await fetchJson<DummyProduct>(`/products/${productId}`);
    const mappedReviews = (product.reviews || []).map((review, index) => ({
      id: `${product.id}-review-${index}`,
      product_id: String(product.id),
      user_id: `${product.id}-user-${index}`,
      user_name: review.reviewerName || `Cliente ${index + 1}`,
      rating: Math.max(1, Math.min(5, Math.round(review.rating ?? product.rating ?? 5))),
      title: `Review ${index + 1}`,
      comment: review.comment || 'Satisfied customer.',
      is_verified: true,
      created_at: review.date || new Date().toISOString(),
    }));

    if (mappedReviews.length) {
      return localizeReviews(mappedReviews, targetLanguage);
    }
  } catch {
    // fallback below
  }

  const mockMatches = mockReviews.filter((review) => review.product_id === productId);
  if (mockMatches.length) return localizeReviews(mockMatches, targetLanguage);

  const fallbackProduct = mockProducts.find((item) => item.id === productId);
  if (!fallbackProduct) return [];

  return localizeReviews([
    {
      id: `${fallbackProduct.id}-fallback-review`,
      product_id: fallbackProduct.id,
      user_id: `${fallbackProduct.id}-fallback-user`,
      user_name: 'Cliente verificado',
      rating: Math.max(4, Math.round(fallbackProduct.rating || 4)),
      title: 'Great product',
      comment: 'Good build quality, beautiful visuals and a consistent experience.',
      is_verified: true,
      created_at: new Date().toISOString(),
    },
  ], targetLanguage);
}
