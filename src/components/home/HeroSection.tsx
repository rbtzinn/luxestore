import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&q=80" 
          alt="Premium craftsmanship" 
          className="w-full h-full object-cover opacity-60" 
          loading="eager" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/50 to-primary" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }} 
          className="text-xs md:text-sm font-body tracking-[0.4em] uppercase text-primary-foreground/70 mb-6"
        >
          {t('home.storyEyebrow')}
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.4 }} 
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-primary-foreground leading-[1.1] mb-8"
        >
          {t('home.storyTitleLine1')}
          <br />
          <span className="italic font-light">{t('home.storyTitleLine2')}</span>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.8 }} 
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/products" className="inline-flex items-center gap-3 px-8 py-4 bg-primary-foreground text-primary rounded-lg font-body font-medium text-sm tracking-wide hover:opacity-90 transition-all duration-300 group">
            {t('home.exploreCollection')}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link to="/categories" className="inline-flex items-center gap-3 px-8 py-4 border border-primary-foreground/20 text-primary-foreground rounded-lg font-body font-medium text-sm tracking-wide hover:bg-primary-foreground/10 transition-all duration-300">
            {t('home.shopByCategory')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
