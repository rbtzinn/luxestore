import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockProducts } from '@/data/mockData';
import { useProducts } from '@/hooks/useCatalog';
import { formatCurrency } from '@/lib/locale';

export default function FeaturedProductSection() {
  const { data: productsData = [] } = useProducts();
  const product = productsData.find((item) => item.featured) || productsData[0] || mockProducts[0];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  return (
    <section ref={ref} className="premium-section bg-secondary/30 overflow-hidden">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div style={{ y: imageY }} className="relative aspect-square rounded-2xl overflow-hidden">
            <img src={product.images[0]?.url} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
            {product.sale_price && <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-body font-semibold px-3 py-1.5 rounded-full">{t('common.save')} {formatCurrency(product.price - product.sale_price, language)}</div>}
          </motion.div>
          <motion.div style={{ y: textY }}>
            <p className="text-xs font-body tracking-[0.4em] uppercase text-muted-foreground mb-4">{t('home.featured')}</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">{product.title}</h2>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />)}</div>
              <span className="text-sm font-body text-muted-foreground">{product.rating} ({t('productPage.reviewCount_other', { count: product.review_count })})</span>
            </div>
            <p className="text-base font-body text-muted-foreground leading-relaxed mb-8 max-w-lg">{product.description}</p>
            <div className="flex items-baseline gap-3 mb-8">
              {product.sale_price ? (<><span className="text-3xl font-display font-bold text-foreground">{formatCurrency(product.sale_price, language)}</span><span className="text-lg font-body text-muted-foreground line-through">{formatCurrency(product.price, language)}</span></>) : <span className="text-3xl font-display font-bold text-foreground">{formatCurrency(product.price, language)}</span>}
            </div>
            <Link to={`/products/${product.slug}`} className="btn-premium group">{t('common.viewProduct')}<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
