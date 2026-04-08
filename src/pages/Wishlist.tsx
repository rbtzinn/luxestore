import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductPrice from '@/components/product/ProductPrice';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">{t('wishlistPage.emptyTitle')}</h1>
          <p className="text-sm font-body text-muted-foreground mb-8">{t('wishlistPage.emptyDescription')}</p>
          <Link to="/products" className="btn-premium">{t('common.browseProducts')}</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-premium py-12">
        <div className="flex items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-display font-bold text-foreground">{t('wishlistPage.title')} ({items.length})</h1>
          <button onClick={clearWishlist} className="text-xs font-body text-muted-foreground hover:text-destructive transition-colors">{t('common.clearAll')}</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <motion.div key={product.id} layout className="group">
              <Link to={`/products/${product.slug}`} className="block">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-4">
                  <img src={product.images[0]?.url} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      removeItem(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm"
                    aria-label={t('common.remove')}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        addToCart(product);
                      }}
                      className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium"
                    >
                      <ShoppingBag className="w-3 h-3 inline mr-1" /> {t('common.addToCart')}
                    </button>
                  </div>
                </div>
              </Link>
              <p className="text-xs font-body text-muted-foreground mb-1">{product.brand}</p>
              <h3 className="text-sm font-body font-medium text-foreground mb-1">{product.title}</h3>
              <ProductPrice price={product.price} salePrice={product.sale_price} language={language} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
