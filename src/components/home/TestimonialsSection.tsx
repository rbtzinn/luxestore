import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockReviews } from '@/data/mockData';
import { localizeReviews } from '@/lib/dynamicTranslations';

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState(mockReviews);

  useEffect(() => {
    let isMounted = true;
    localizeReviews(mockReviews, i18n.resolvedLanguage || i18n.language).then((items) => {
      if (isMounted) setReviews(items);
    });
    return () => { isMounted = false; };
  }, [i18n.resolvedLanguage, i18n.language]);

  return (
    <section className="premium-section bg-background">
      <div className="container-premium">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-xs font-body tracking-[0.4em] uppercase text-muted-foreground mb-3">{t('home.testimonialsEyebrow')}</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">{t('home.testimonialsTitle')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="glass-card p-8 relative">
              <Quote className="w-8 h-8 text-muted-foreground/10 absolute top-6 right-6" />
              <div className="flex items-center gap-1 mb-4">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground/20'}`} />)}</div>
              <h4 className="text-base font-display font-semibold text-foreground mb-2">{review.title}</h4>
              <p className="text-sm font-body text-muted-foreground leading-relaxed mb-6">"{review.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"><span className="text-sm font-body font-semibold text-secondary-foreground">{review.user_name.charAt(0)}</span></div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground">{review.user_name}</p>
                  {review.is_verified && <p className="text-xs font-body text-success">{t('common.verifiedBuyer')}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
