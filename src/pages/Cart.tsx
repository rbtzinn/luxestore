import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RatingStars from '@/components/product/RatingStars';
import { formatCurrency } from '@/lib/locale';
import { useCartStore } from '@/store/cartStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-body font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {items.length} {items.length === 1 ? 'item selecionado' : 'itens selecionados'}
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{t('cartPage.title')}</h1>
          </div>
          <Link to="/products" className="text-sm font-body font-medium text-muted-foreground transition-colors hover:text-foreground">
            Continuar comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const product = item.product;
              const productUrl = product?.slug ? `/products/${product.slug}` : '/products';
              const image = product?.images[0];
              const lineTotal = item.price * item.quantity;
              const maxQuantity = Math.max(product?.stock || item.quantity, 1);

              return (
                <motion.div key={item.id} layout className="glass-card p-4 md:p-5">
                  <div className="grid grid-cols-[96px_1fr] gap-4 md:grid-cols-[144px_1fr] md:gap-6">
                    <Link to={productUrl} className="h-24 w-24 overflow-hidden rounded-lg bg-secondary md:h-36 md:w-36">
                      {image ? (
                        <img src={image.url} alt={image.alt || product?.title || 'Produto'} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                    </Link>

                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="mb-1 text-xs font-body text-muted-foreground">{product?.brand || 'Produto'}</p>
                          <Link to={productUrl} className="line-clamp-2 text-base font-body font-semibold text-foreground transition-colors hover:text-accent md:text-lg">
                            {product?.title || 'Produto removido do catalogo'}
                          </Link>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              aria-label={t('common.remove')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover do carrinho?</AlertDialogTitle>
                              <AlertDialogDescription>Tem certeza que deseja remover este item do seu carrinho?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeItem(item.product_id)}>Remover</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      {product?.description ? (
                        <p className="mt-2 line-clamp-2 text-sm font-body leading-relaxed text-muted-foreground">{product.description}</p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-body text-muted-foreground">
                        {product?.category?.name ? <span>{product.category.name}</span> : null}
                        {product?.sku ? <span>SKU {product.sku}</span> : null}
                        {product ? (
                          <span className={product.stock > 0 ? 'text-success' : 'text-destructive'}>
                            {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
                          </span>
                        ) : null}
                      </div>

                      {product ? (
                        <div className="mt-3 flex items-center gap-2">
                          <RatingStars rating={product.rating} className="h-3.5 w-3.5" />
                          <span className="text-xs font-body text-muted-foreground">({product.review_count})</span>
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="mb-2 text-xs font-body uppercase tracking-[0.16em] text-muted-foreground">{t('common.quantity')}</p>
                          <div className="flex w-fit items-center rounded-lg border border-border">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                              aria-label={t('cartPage.decrease')}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-11 text-center text-sm font-body font-medium text-foreground">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product_id, Math.min(maxQuantity, item.quantity + 1))}
                              disabled={item.quantity >= maxQuantity}
                              className="p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={t('cartPage.increase')}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 text-sm font-body sm:text-right">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Unitario</p>
                            <p className="mt-1 font-medium text-foreground">{formatCurrency(item.price, language)}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Subtotal</p>
                            <p className="mt-1 font-semibold text-foreground">{formatCurrency(lineTotal, language)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              {shipping > 0 ? <p className="text-xs font-body text-muted-foreground mt-3">{t('cartPage.freeShippingNotice')}</p> : null}
              <Link to="/checkout" className="btn-premium w-full mt-6">
                {t('common.checkout')} <ArrowRight className="w-4 h-4" />
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full text-center text-xs font-body text-muted-foreground hover:text-destructive mt-3 transition-colors">
                    {t('common.clearCart')}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Esvaziar carrinho?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover todos os itens do carrinho? Esta acao nao pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={clearCart}>Esvaziar Carrinho</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
