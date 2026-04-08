import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getProductBySlug, listCategories, listProducts, listReviews } from '@/services/catalog';
import { normalizeLanguage } from '@/lib/locale';

function useCatalogLanguage() {
  const { i18n } = useTranslation();
  return normalizeLanguage(i18n.resolvedLanguage || i18n.language);
}

function useCatalogQuery<TData>({
  key,
  queryFn,
  enabled = true,
}: {
  key: readonly unknown[];
  queryFn: (language: string) => Promise<TData>;
  enabled?: boolean;
}) {
  const language = useCatalogLanguage();

  return useQuery({
    queryKey: ['catalog', ...key, language],
    queryFn: () => queryFn(language),
    enabled,
  });
}

export function useProducts() {
  return useCatalogQuery({
    key: ['products'],
    queryFn: listProducts,
  });
}

export function useCategories() {
  return useCatalogQuery({
    key: ['categories'],
    queryFn: listCategories,
  });
}

export function useProduct(slug?: string) {
  return useCatalogQuery({
    key: ['product', slug],
    queryFn: (language) => getProductBySlug(slug ?? '', language),
    enabled: Boolean(slug),
  });
}

export function useProductReviews(productId?: string) {
  return useCatalogQuery({
    key: ['reviews', productId],
    queryFn: (language) => listReviews(productId ?? '', language),
    enabled: Boolean(productId),
  });
}
