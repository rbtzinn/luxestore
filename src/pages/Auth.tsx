import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, DatabaseZap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Auth() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl glass-card p-8 md:p-10">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
          <DatabaseZap className="w-7 h-7 text-foreground" />
        </div>

        <p className="text-xs font-body tracking-[0.35em] uppercase text-muted-foreground mb-3">{t('authPage.eyebrow')}</p>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{t('authPage.title')}</h1>
        <p className="text-sm md:text-base font-body text-muted-foreground leading-relaxed mb-8">{t('authPage.description')}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/products" className="btn-premium justify-center">
            {t('authPage.viewCatalog')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/admin" className="btn-premium-outline justify-center">
            {t('authPage.openDemoPanel')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
