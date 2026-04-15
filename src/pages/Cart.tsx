import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/locale';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">{t('cartPage.emptyTitle')}</h1>
          <p className="text-sm font-body text-muted-foreground mb-8">{t('cartPage.emptyDescription')}</p>
          <Link to="/products" className="btn-premium">
            {t('cartPage.startShopping')} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  const total = getTotal();
  const shipping = total > 150 ? 0 : 15;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-premium py-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">{t('cartPage.title')}</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-4 lg:col-span-2 lg:space-y-6">
            {items.map((item) => (
              <motion.div key={item.id} layout className="glass-card p-4">
                <div className="flex items-start gap-3 md:gap-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary md:h-32 md:w-32">
                    <img src={item.product?.images[0]?.url || ''} alt={item.product?.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.product?.slug}`}
                      className="line-clamp-2 text-sm font-body font-medium text-foreground transition-colors hover:text-accent md:text-base"
                    >
                      {item.product?.title}
                    </Link>
                    <p className="mt-1 text-xs font-body text-muted-foreground">{item.product?.brand}</p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex w-fit items-center rounded-lg border border-border">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-2"
                          aria-label={t('cartPage.decrease')}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-body">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-2"
                          aria-label={t('cartPage.increase')}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span className="text-sm font-body font-semibold text-foreground md:text-base">
                          {formatCurrency(item.price * item.quantity, language)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="rounded-full p-2 text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={t('common.remove')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card p-5 md:p-6">
              <h2 className="text-lg font-display font-semibold text-foreground mb-6">{t('cartPage.summary')}</h2>
              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('common.subtotal')}</span>
                  <span className="text-foreground">{formatCurrency(total, language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('common.shipping')}</span>
                  <span className="text-foreground">{shipping === 0 ? t('common.free') : formatCurrency(shipping, language)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">{t('common.total')}</span>
                  <span className="font-semibold text-foreground">{formatCurrency(total + shipping, language)}</span>
                </div>
              </div>
              {shipping > 0 && <p className="text-xs font-body text-muted-foreground mt-3">{t('cartPage.freeShippingNotice')}</p>}
              <Link to="/checkout" className="btn-premium w-full mt-6">
                {t('common.checkout')} <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={clearCart} className="w-full text-center text-xs font-body text-muted-foreground hover:text-destructive mt-3 transition-colors">
                {t('common.clearCart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
