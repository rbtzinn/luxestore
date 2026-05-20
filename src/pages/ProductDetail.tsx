import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductPrice from '@/components/product/ProductPrice';
import RatingStars from '@/components/product/RatingStars';
import { mockProducts } from '@/data/mockData';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency } from '@/lib/locale';
import { useProduct, useProductReviews, useProducts } from '@/hooks/useCatalog';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { addItem: _addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const { data: dbProduct, isLoading } = useProduct(slug as string);
  const product = dbProduct ?? mockProducts.find((item) => item.slug === slug);
  const { data: allProducts = mockProducts } = useProducts();
  const { data: reviews = [] } = useProductReviews(product?.id);

  const relatedProducts = useMemo(
    () => allProducts.filter((item) => item.category_id === product?.category_id && item.id !== product?.id).slice(0, 4),
    [allProducts, product],
  );

  const addToCart = (product: Product, quantity: number) => {
    _addToCart(product, quantity);
    toast.success('Adicionado ao carrinho com sucesso!', {
      description: `${quantity}x ${product.title}`,
      icon: <ShoppingBag className="w-4 h-4" />,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

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
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-secondary mb-4 group cursor-crosshair"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[selectedImage]?.url}
                  alt={product.images[selectedImage]?.alt}
                  className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isHovered ? 'scale-150' : 'scale-100'}`}
                  style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                  }}
                />
              </AnimatePresence>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-premium-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-premium-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {product.images.length > 1 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-foreground' : 'border-transparent opacity-70 hover:opacity-100'}`}
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="btn-premium flex-1 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out rounded-lg" />
                <ShoppingBag className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{t('common.addToCart')} - {formatCurrency(effectivePrice * quantity, language)}</span>
              </motion.button>
              <button onClick={toggleWishlist} className="btn-premium-outline" aria-label={t('common.wishlist')}>
                <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? 'fill-destructive text-destructive' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center group">
                  <div className="p-3 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
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
                  <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-3 relative">
                    <img src={relatedProduct.images[0]?.url} alt={relatedProduct.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
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
