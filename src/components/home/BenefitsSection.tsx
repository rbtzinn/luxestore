import { motion } from 'framer-motion';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BenefitsSection() {
  const { t } = useTranslation();
  const benefits = [
    { icon: Truck, title: t('home.benefit1Title'), description: t('home.benefit1Description') },
    { icon: Shield, title: t('home.benefit2Title'), description: t('home.benefit2Description') },
    { icon: RotateCcw, title: t('home.benefit3Title'), description: t('home.benefit3Description') },
    { icon: Headphones, title: t('home.benefit4Title'), description: t('home.benefit4Description') },
  ];

  return (
    <section className="premium-section bg-secondary/30">
      <div className="container-premium">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-xs font-body tracking-[0.4em] uppercase text-muted-foreground mb-3">{t('home.whyEyebrow')}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">{t('home.whyTitle')}</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div key={benefit.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/5 mb-5"><benefit.icon className="w-6 h-6 text-foreground" /></div>
              <h3 className="text-base font-display font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
