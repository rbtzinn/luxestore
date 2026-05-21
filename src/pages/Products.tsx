import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductPrice from '@/components/product/ProductPrice';
import RatingStars from '@/components/product/RatingStars';
import { PremiumSelect } from '@/components/ui/premium-select';
import { mockCategories } from '@/data/mockData';
import { useCategories, useProducts } from '@/hooks/useCatalog';
import { showAddedToCartToast, showWishlistToast } from '@/lib/cartFeedback';
import { animateScrollToTop } from '@/lib/scroll';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types';

const sortOptions = ['relevance', 'price-asc', 'price-desc', 'rating', 'newest'] as const;
type SortOption = (typeof sortOptions)[number];

function sortProducts(products: Product[], sortBy: SortOption) {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    case 'price-desc':
      return sorted.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    default:
      return sorted;
  }
}

function getCategoryButtonClass(isActive: boolean) {
  return `block text-sm font-body transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);
  const hasMountedRef = useRef(false);
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const requestAddToCart = useCartStore((state) => state.requestAddItem);
  const hasCartItem = useCartStore((state) => state.hasItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { data: products = [], isLoading } = useProducts();
  const { data: categoriesData = [] } = useCategories();
  const categories = categoriesData.length ? categoriesData : mockCategories;
  const categoryFromUrl = searchParams.get('category') || '';
  const filterFromUrl = searchParams.get('filter') || '';
  
  const pageTitle = 
    filterFromUrl === 'new' ? t('footer.newArrivals') :
    filterFromUrl === 'sale' ? t('footer.sale') :
    location.pathname === '/categories' ? t('common.categories') : 
    t('productsPage.title');

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    animateScrollToTop(520);
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter((product) =>
        [product.title, product.brand, product.description].some((value) => value.toLowerCase().includes(query)),
      );
    }

    if (selectedCategory) {
      const category = categories.find((item) => item.slug === selectedCategory);
      if (category) {
        result = result.filter((product) => product.category_id === category.id);
      }
    }

    if (filterFromUrl === 'new') {
      result = result.filter((product) => product.featured);
    }

    if (filterFromUrl === 'sale') {
      result = result.filter((product) => product.sale_price != null);
    }

    return sortProducts(result, sortBy);
  }, [categories, products, search, selectedCategory, sortBy, filterFromUrl]);

  const sortLabels: Record<SortOption, string> = {
    relevance: t('productsPage.relevance'),
    'price-asc': t('productsPage.priceLowHigh'),
    'price-desc': t('productsPage.priceHighLow'),
    rating: t('productsPage.topRated'),
    newest: t('productsPage.newest'),
  };

  const applyCategory = (category: string) => {
    setSelectedCategory(category);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (category) {
        nextParams.set('category', category);
      } else {
        nextParams.delete('category');
      }

      return nextParams;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/30 py-16 md:py-24">
        <div className="container-premium">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            {pageTitle}
          </motion.h1>
          <p className="text-base font-body text-muted-foreground">
            {isLoading ? t('common.loadingProducts') : t('productsPage.count_other', { count: filteredProducts.length })}
          </p>
        </div>
      </div>

      <div className="container-premium py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('productsPage.searchPlaceholder')} className="input-premium pl-10" />
          </div>
          <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
            <button onClick={() => setShowFilters((current) => !current)} className="btn-premium-outline md:hidden w-full">
              <SlidersHorizontal className="w-4 h-4" />
              {t('common.filters')}
            </button>
            <PremiumSelect
              value={sortBy}
              onValueChange={setSortBy}
              options={sortOptions.map((option) => ({ value: option, label: sortLabels[option] }))}
              className="w-full md:min-w-[180px]"
            />
          </div>
        </div>

        <div className="flex gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0 self-start sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto`}>
            <div>
              <h3 className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">{t('common.categories')}</h3>
              <div className="space-y-2">
                <button onClick={() => applyCategory('')} className={getCategoryButtonClass(!selectedCategory)}>
                  {t('common.allCategories')}
                </button>
                {categories.map((category) => (
                  <button key={category.id} onClick={() => applyCategory(category.slug)} className={getCategoryButtonClass(selectedCategory === category.slug)}>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-body text-muted-foreground">{isLoading ? t('common.loading') : t('common.noProductsFound')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => {
                  const isFavorite = isInWishlist(product.id);

                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="group">
                      <Link to={`/products/${product.slug}`} className="block">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-4">
                          <img src={product.images[0]?.url} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                          {product.sale_price ? <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-body font-semibold px-2 py-1 rounded-full">{t('common.sale')}</div> : null}
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              if (isFavorite) {
                                removeFromWishlist(product.id);
                              } else {
                                addToWishlist(product);
                                showWishlistToast(product, true);
                              }
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={t('common.wishlist')}
                          >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
                          </button>
                          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(event) => {
                                event.preventDefault();
                                const alreadyInCart = hasCartItem(product.id);
                                requestAddToCart(product);
                                if (!alreadyInCart) {
                                  showAddedToCartToast(product);
                                }
                              }}
                              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium"
                            >
                              {t('common.addToCart')}
                            </button>
                          </div>
                        </div>
                      </Link>
                      <p className="text-xs font-body text-muted-foreground mb-1">{product.brand}</p>
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="text-sm font-body font-medium text-foreground mb-1">{product.title}</h3>
                      </Link>
                      <div className="flex items-center gap-1 mb-2">
                        <RatingStars rating={product.rating} className="w-3 h-3" />
                      </div>
                      <ProductPrice price={product.price} salePrice={product.sale_price} language={language} />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
