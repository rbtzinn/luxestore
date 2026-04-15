import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockProducts } from '@/data/mockData';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProducts } from '@/hooks/useCatalog';
import { formatCurrency } from '@/lib/locale';

export default function ProductGridSection() {
  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { data: productsData = [] } = useProducts();
  const products = (productsData.length ? productsData : mockProducts).slice(0, 8);
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  return (
    <section className="premium-section bg-background">
      <div className="container-premium">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs font-body tracking-[0.4em] uppercase text-muted-foreground mb-3">{t('home.collectionEyebrow')}</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">{t('home.collectionTitle')}</h2>
          </div>
          <Link to="/products" className="text-sm font-body font-medium text-foreground hover:text-accent transition-colors mt-4 md:mt-0">{t('common.viewAll')} →</Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: index * 0.05 }} className="group">
              <Link to={`/products/${product.slug}`} className="block">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-4">
                  <img src={product.images[0]?.url} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  {product.sale_price && <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-body font-semibold px-2 py-1 rounded-full">{t('common.sale')}</div>}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id);
                        return;
                      }
                      addToWishlist(product);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label={isInWishlist(product.id) ? t('common.remove') : t('common.wishlist')}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={(e) => { e.preventDefault(); addToCart(product); }} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium hover:opacity-90 transition-opacity">{t('common.addToCart')}</button>
                  </div>
                </div>
              </Link>
              <div>
                <p className="text-xs font-body text-muted-foreground mb-1">{product.brand}</p>
                <Link to={`/products/${product.slug}`}><h3 className="text-sm font-body font-medium text-foreground mb-1 hover:text-accent transition-colors">{product.title}</h3></Link>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-muted-foreground/20'}`} />)}
                  <span className="text-xs text-muted-foreground ml-1">({product.review_count})</span>
                </div>
                <div className="flex items-baseline gap-2">
                  {product.sale_price ? (<><span className="text-sm font-body font-semibold text-foreground">{formatCurrency(product.sale_price, language)}</span><span className="text-xs font-body text-muted-foreground line-through">{formatCurrency(product.price, language)}</span></>) : <span className="text-sm font-body font-semibold text-foreground">{formatCurrency(product.price, language)}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
