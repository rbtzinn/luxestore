import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1600&q=80" alt="Premium lifestyle" className="w-full h-full object-cover opacity-20" loading="lazy" />
      </div>
      <div className="relative z-10 container-premium text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight">
            {t('home.ctaTitleLine1')}
            <br />
            <span className="italic font-light">{t('home.ctaTitleLine2')}</span>
          </h2>
          <p className="text-base md:text-lg font-body text-primary-foreground/60 max-w-lg mx-auto mb-10">{t('home.ctaDescription')}</p>
          <Link to="/products" className="inline-flex items-center gap-3 px-10 py-4 bg-primary-foreground text-primary rounded-lg font-body font-medium text-sm tracking-wide hover:opacity-90 transition-all duration-300 group">
            {t('home.shopNow')}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
