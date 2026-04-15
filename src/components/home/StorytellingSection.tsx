import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type NarrativeStepProps = {
  description: string;
  index: number;
  progress: MotionValue<number>;
  title: string;
  totalSteps: number;
};

function NarrativeStep({ description, index, progress, title, totalSteps }: NarrativeStepProps) {
  const start = (index + 0.5) / (totalSteps + 1);
  const peak = (index + 1) / (totalSteps + 1);
  const end = (index + 1.5) / (totalSteps + 1);
  const opacity = useTransform(progress, [start, peak, end], [0, 1, 0]);
  const translateY = useTransform(progress, [start, peak, end], [40, 0, -40]);

  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y: translateY }}>
      <span className="mb-4 text-xs font-body uppercase tracking-[0.3em] text-accent">0{index + 1}</span>
      <h3 className="mb-4 text-2xl font-display font-semibold text-primary-foreground md:text-3xl">{title}</h3>
      <p className="max-w-md text-base font-body leading-relaxed text-primary-foreground/60">{description}</p>
    </motion.div>
  );
}

export default function StorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  const narrativeSteps = [
    { title: t('home.storyStep1Title'), description: t('home.storyStep1Description') },
    { title: t('home.storyStep2Title'), description: t('home.storyStep2Description') },
    { title: t('home.storyStep3Title'), description: t('home.storyStep3Description') },
  ];

  return (
    <section ref={containerRef} className="relative" style={{ height: `${(narrativeSteps.length + 1) * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&q=80"
            alt="Premium craftsmanship"
            className="h-full w-full object-cover"
            style={{ scale: backgroundScale }}
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="relative z-10 container-premium">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <motion.p style={{ opacity: eyebrowOpacity }} className="mb-4 text-xs font-body uppercase tracking-[0.4em] text-primary-foreground/40">
                {t('home.storyEyebrow')}
              </motion.p>
              <motion.h2 style={{ opacity: titleOpacity }} className="text-4xl font-display font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
                {t('home.storyTitleLine1')}
                <br />
                <span className="font-light italic">{t('home.storyTitleLine2')}</span>
              </motion.h2>
            </div>
            <div className="relative min-h-[200px]">
              {narrativeSteps.map((step, index) => (
                <NarrativeStep
                  key={step.title}
                  description={step.description}
                  index={index}
                  progress={scrollYProgress}
                  title={step.title}
                  totalSteps={narrativeSteps.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
