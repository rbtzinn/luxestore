import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ChevronRight, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductPrice from '@/components/product/ProductPrice';
import RatingStars from '@/components/product/RatingStars';
import { mockProducts } from '@/data/mockData';
import { useProduct, useProductReviews, useProducts } from '@/hooks/useCatalog';
import { formatCurrency } from '@/lib/locale';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

export default function ProductDetail() {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { data: fetchedProduct, isLoading } = useProduct(slug);
  const product = fetchedProduct ?? mockProducts.find((item) => item.slug === slug);
  const { data: allProducts = mockProducts } = useProducts();
  const { data: reviews = [] } = useProductReviews(product?.id);

  const relatedProducts = useMemo(
    () => allProducts.filter((item) => item.category_id === product?.category_id && item.id !== product?.id).slice(0, 4),
    [allProducts, product],
  );

  if (!product && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">{t('productPage.notFound')}</h1>
          <Link to="/products" className="btn-premium">{t('common.browseProducts')}</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">{t('common.loadingProduct')}</div>;
  }

  const effectivePrice = product.sale_price ?? product.price;
  const highlights = [
    { icon: Truck, label: t('productPage.freeShipping') },
    { icon: Shield, label: t('productPage.securePayment') },
    { icon: RotateCcw, label: t('productPage.returns') },
  ];
  const details = [
    { label: t('admin.sku'), value: product.sku },
    { label: t('productPage.category'), value: product.category?.name },
    { label: t('productPage.brand'), value: product.brand },
  ];
  const toggleWishlist = () => (isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product));

  return (
    <div className="min-h-screen bg-background">
      <div className="container-premium py-4">
        <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">{t('common.home')}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-foreground transition-colors">{t('common.products')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.title}</span>
        </nav>
      </div>

      <div className="container-premium pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-4">
              <img src={product.images[selectedImage]?.url} alt={product.images[selectedImage]?.alt} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 ? (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-foreground' : 'border-transparent'}`}
                  >
                    <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground mb-2">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{product.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                <RatingStars rating={product.rating} />
              </div>
              <span className="text-sm font-body text-muted-foreground">{product.rating} ({t('productPage.reviewCount_other', { count: reviews.length || product.review_count })})</span>
            </div>

            <ProductPrice
              price={product.price}
              salePrice={product.sale_price}
              language={language}
              currentClassName="text-3xl font-display font-bold text-foreground"
              previousClassName="text-lg font-body text-muted-foreground line-through"
            >
              {product.sale_price ? (
                <span className="badge-status bg-accent/10 text-accent">
                  {t('productPage.discountOff', { value: Math.round(((product.price - product.sale_price) / product.price) * 100) })}
                </span>
              ) : null}
            </ProductPrice>

            <p className="text-sm font-body text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            <div className="mb-6">
              <span className={`text-sm font-body ${product.stock > 10 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-destructive'}`}>
                {product.stock > 10 ? t('productPage.inStock') : product.stock > 0 ? t('productPage.onlyLeft', { count: product.stock }) : t('productPage.outOfStock')}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-body font-medium text-foreground">{t('common.quantity')}</span>
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="p-3 hover:bg-secondary transition-colors" aria-label={t('cartPage.decrease')}>
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-body font-medium">{quantity}</span>
                <button onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} className="p-3 hover:bg-secondary transition-colors" aria-label={t('cartPage.increase')}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={() => addToCart(product, quantity)} disabled={product.stock === 0} className="btn-premium flex-1">
                <ShoppingBag className="w-4 h-4" />
                {t('common.addToCart')} - {formatCurrency(effectivePrice * quantity, language)}
              </button>
              <button onClick={toggleWishlist} className="btn-premium-outline" aria-label={t('common.wishlist')}>
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-destructive text-destructive' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs font-body text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm font-body">
              {details.map((detail) => (
                <div key={detail.label} className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">{detail.label}</span>
                  <span className="text-foreground">{detail.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-20">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">{t('productPage.customerReviews')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="glass-card p-6">
                  <div className="flex items-center gap-1 mb-3">
                    <RatingStars rating={review.rating} />
                  </div>
                  <h4 className="text-sm font-body font-semibold text-foreground mb-1">{review.title}</h4>
                  <p className="text-sm font-body text-muted-foreground mb-3">{review.comment}</p>
                  <p className="text-xs font-body text-muted-foreground">
                    {review.user_name} {review.is_verified ? `- ${t('common.verified')}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {relatedProducts.length > 0 ? (
          <div className="mt-20">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">{t('productPage.youMayAlsoLike')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/products/${relatedProduct.slug}`} className="group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-3">
                    <img src={relatedProduct.images[0]?.url} alt={relatedProduct.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <h3 className="text-sm font-body font-medium text-foreground">{relatedProduct.title}</h3>
                  <ProductPrice
                    price={relatedProduct.price}
                    salePrice={relatedProduct.sale_price}
                    language={language}
                    currentClassName="text-sm font-body text-muted-foreground"
                    previousClassName="hidden"
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
