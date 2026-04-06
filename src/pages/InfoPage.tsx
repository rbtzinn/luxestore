import { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const pageKeyByPath: Record<string, string> = {
  '/contact': 'contact',
  '/shipping': 'shipping',
  '/faq': 'faq',
  '/size-guide': 'sizeGuide',
  '/careers': 'careers',
  '/press': 'press',
  '/sustainability': 'sustainability',
  '/privacy': 'privacy',
  '/terms': 'terms',
};

export default function InfoPage() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const pageKey = useMemo(() => pageKeyByPath[pathname] || 'contact', [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="container-premium">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-body font-semibold tracking-[0.28em] uppercase text-muted-foreground mb-4"
          >
            LUXE Store
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-display font-bold text-foreground max-w-4xl leading-tight"
          >
            {t(`infoPages.${pageKey}.title`)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl text-base md:text-lg font-body text-muted-foreground leading-relaxed"
          >
            {t(`infoPages.${pageKey}.subtitle`)}
          </motion.p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-premium grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border border-border/60 bg-secondary/30 p-8 md:p-10"
          >
            <p className="text-sm md:text-base font-body text-muted-foreground leading-relaxed max-w-2xl">
              {t(`infoPages.${pageKey}.body`)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-border/60 bg-primary text-primary-foreground p-8 md:p-10"
          >
            <h2 className="text-2xl font-display font-bold mb-4">LUXE</h2>
            <p className="text-sm md:text-base font-body text-primary-foreground/70 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <Link to="/products" className="inline-flex items-center gap-3 text-sm font-body font-medium hover:opacity-90">
              {t('common.browseProducts')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
