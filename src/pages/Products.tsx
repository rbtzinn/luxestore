import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Heart, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockCategories } from '@/data/mockData';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCategories, useProducts } from '@/hooks/useCatalog';
import { formatCurrency } from '@/lib/locale';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { data: products = [], isLoading } = useProducts();
  const { data: categoriesData = [] } = useCategories();
  const categories = categoriesData.length ? categoriesData : mockCategories;

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) result = result.filter((p) => p.category_id === cat.id);
    }
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price)); break;
      case 'price-desc': result.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price)); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      default: break;
    }
    return result;
  }, [products, search, sortBy, selectedCategory, categories]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/30 py-16 md:py-24">
        <div className="container-premium">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            {t('productsPage.title')}
          </motion.h1>
          <p className="text-base font-body text-muted-foreground">
            {isLoading ? t('common.loadingProducts') : t('productsPage.count_other', { count: filtered.length })}
          </p>
        </div>
      </div>

      <div className="container-premium py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('productsPage.searchPlaceholder')} className="input-premium pl-10" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="btn-premium-outline md:hidden">
              <SlidersHorizontal className="w-4 h-4" />
              {t('common.filters')}
            </button>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-premium pr-10 appearance-none min-w-[180px]">
                <option value="relevance">{t('productsPage.relevance')}</option>
                <option value="price-asc">{t('productsPage.priceLowHigh')}</option>
                <option value="price-desc">{t('productsPage.priceHighLow')}</option>
                <option value="rating">{t('productsPage.topRated')}</option>
                <option value="newest">{t('productsPage.newest')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0`}>
            <div className="sticky top-24">
              <h3 className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">{t('common.categories')}</h3>
              <div className="space-y-2">
                <button onClick={() => setSelectedCategory('')} className={`block text-sm font-body transition-colors ${!selectedCategory ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                  {t('common.allCategories')}
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.slug)} className={`block text-sm font-body transition-colors ${selectedCategory === cat.slug ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-body text-muted-foreground">{isLoading ? t('common.loading') : t('common.noProductsFound')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product, index) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="group">
                    <Link to={`/products/${product.slug}`} className="block">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-4">
                        <img src={product.images[0]?.url} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                        {product.sale_price && <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-body font-semibold px-2 py-1 rounded-full">{t('common.sale')}</div>}
                        <button onClick={(e) => { e.preventDefault(); isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product); }} className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-label={t('common.wishlist')}>
                          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
                        </button>
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.preventDefault(); addToCart(product); }} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium">
                            {t('common.addToCart')}
                          </button>
                        </div>
                      </div>
                    </Link>
                    <p className="text-xs font-body text-muted-foreground mb-1">{product.brand}</p>
                    <Link to={`/products/${product.slug}`}><h3 className="text-sm font-body font-medium text-foreground mb-1">{product.title}</h3></Link>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-muted-foreground/20'}`} />)}
                    </div>
                    <div className="flex items-baseline gap-2">
                      {product.sale_price ? (
                        <>
                          <span className="text-sm font-body font-semibold text-foreground">{formatCurrency(product.sale_price, language)}</span>
                          <span className="text-xs font-body text-muted-foreground line-through">{formatCurrency(product.price, language)}</span>
                        </>
                      ) : <span className="text-sm font-body font-semibold text-foreground">{formatCurrency(product.price, language)}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
