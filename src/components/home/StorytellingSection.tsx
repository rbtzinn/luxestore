import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function StorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const narrativeSteps = [
    { title: t('home.storyStep1Title'), description: t('home.storyStep1Description') },
    { title: t('home.storyStep2Title'), description: t('home.storyStep2Description') },
    { title: t('home.storyStep3Title'), description: t('home.storyStep3Description') },
  ];

  return (
    <section ref={containerRef} className="relative" style={{ height: `${(narrativeSteps.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&q=80" alt="Premium craftsmanship" className="w-full h-full object-cover" style={{ scale: useTransform(scrollYProgress, [0, 1], [1, 1.15]) }} />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="relative z-10 container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]) }} className="text-xs font-body tracking-[0.4em] uppercase text-primary-foreground/40 mb-4">{t('home.storyEyebrow')}</motion.p>
              <motion.h2 style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [0, 1]) }} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight">
                {t('home.storyTitleLine1')}
                <br />
                <span className="italic font-light">{t('home.storyTitleLine2')}</span>
              </motion.h2>
            </div>
            <div className="relative min-h-[200px]">
              {narrativeSteps.map((step, index) => {
                const start = (index + 0.5) / (narrativeSteps.length + 1);
                const peak = (index + 1) / (narrativeSteps.length + 1);
                const end = (index + 1.5) / (narrativeSteps.length + 1);
                return (
                  <motion.div key={step.title} className="absolute inset-0 flex flex-col justify-center" style={{ opacity: useTransform(scrollYProgress, [start, peak, end], [0, 1, 0]), y: useTransform(scrollYProgress, [start, peak, end], [40, 0, -40]) }}>
                    <span className="text-xs font-body tracking-[0.3em] uppercase text-accent mb-4">0{index + 1}</span>
                    <h3 className="text-2xl md:text-3xl font-display font-semibold text-primary-foreground mb-4">{step.title}</h3>
                    <p className="text-base font-body text-primary-foreground/60 leading-relaxed max-w-md">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
