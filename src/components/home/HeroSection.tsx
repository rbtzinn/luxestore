import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const text1Y = useTransform(scrollYProgress, [0, 0.15], [30, 0]);

  const text2Opacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const text2Y = useTransform(scrollYProgress, [0.15, 0.3], [30, 0]);

  const text3Opacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const text3Y = useTransform(scrollYProgress, [0.3, 0.45], [30, 0]);

  const text4Opacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const text4Y = useTransform(scrollYProgress, [0.45, 0.6], [30, 0]);

  const containerOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]);

  return (
    <section ref={ref} className="relative h-[200vh] bg-primary">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80" alt="Premium lifestyle" className="w-full h-full object-cover opacity-40" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary" />
        </motion.div>

        <motion.div style={{ opacity: containerOpacity }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.p style={{ opacity: text1Opacity, y: text1Y }} className="text-xs md:text-sm font-body tracking-[0.4em] uppercase text-primary-foreground/50 mb-6">
            {t('home.heroEyebrow')}
          </motion.p>
          <motion.h1 style={{ opacity: text2Opacity, y: text2Y }} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-primary-foreground leading-[0.95] mb-8">
            {t('home.heroTitleLine1')}
            <br />
            <span className="italic font-light">{t('home.heroTitleLine2')}</span>
          </motion.h1>
          <motion.p style={{ opacity: text3Opacity, y: text3Y }} className="text-base md:text-lg font-body text-primary-foreground/60 max-w-lg mx-auto mb-10 leading-relaxed">
            {t('home.heroDescription')}
          </motion.p>
          <motion.div style={{ opacity: text4Opacity, y: text4Y }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="inline-flex items-center gap-3 px-8 py-4 bg-primary-foreground text-primary rounded-lg font-body font-medium text-sm tracking-wide hover:opacity-90 transition-all duration-300 group">
              {t('home.exploreCollection')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/categories" className="inline-flex items-center gap-3 px-8 py-4 border border-primary-foreground/20 text-primary-foreground rounded-lg font-body font-medium text-sm tracking-wide hover:bg-primary-foreground/10 transition-all duration-300">
              {t('home.shopByCategory')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
