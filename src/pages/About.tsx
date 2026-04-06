import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const cards = [
    { title: t('aboutPage.card1Title'), text: t('aboutPage.card1Text') },
    { title: t('aboutPage.card2Title'), text: t('aboutPage.card2Text') },
    { title: t('aboutPage.card3Title'), text: t('aboutPage.card3Text') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="container-premium">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-body font-semibold tracking-[0.28em] uppercase text-muted-foreground mb-4">
            {t('aboutPage.eyebrow')}
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-4xl md:text-6xl font-display font-bold text-foreground max-w-4xl leading-tight">
            {t('aboutPage.title')}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 max-w-2xl text-base md:text-lg font-body text-muted-foreground leading-relaxed">
            {t('aboutPage.description')}
          </motion.p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-premium grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + index * 0.06 }} className="rounded-2xl border border-border/60 bg-secondary/30 p-6 md:p-8">
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">{item.title}</h2>
              <p className="text-sm md:text-base font-body text-muted-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-premium">
          <div className="rounded-3xl border border-border/60 bg-primary text-primary-foreground p-8 md:p-14">
            <p className="text-xs font-body font-semibold tracking-[0.28em] uppercase text-primary-foreground/60 mb-4">{t('aboutPage.visionEyebrow')}</p>
            <h3 className="text-3xl md:text-5xl font-display font-bold max-w-3xl leading-tight">{t('aboutPage.visionTitle')}</h3>
            <p className="mt-5 max-w-2xl text-sm md:text-base font-body text-primary-foreground/70 leading-relaxed">{t('aboutPage.visionText')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
