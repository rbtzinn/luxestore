import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getProductBySlug, listCategories, listProducts, listReviews } from '@/services/catalog';
import { normalizeLanguage } from '@/lib/locale';

export function useProducts() {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  return useQuery({
    queryKey: ['catalog', 'products', language],
    queryFn: () => listProducts(language),
  });
}

export function useCategories() {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  return useQuery({
    queryKey: ['catalog', 'categories', language],
    queryFn: () => listCategories(language),
  });
}

export function useProduct(slug?: string) {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  return useQuery({
    queryKey: ['catalog', 'product', slug, language],
    queryFn: () => getProductBySlug(slug ?? '', language),
    enabled: Boolean(slug),
  });
}

export function useProductReviews(productId?: string) {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  return useQuery({
    queryKey: ['catalog', 'reviews', productId, language],
    queryFn: () => listReviews(productId ?? '', language),
    enabled: Boolean(productId),
  });
}
