import { mockReviews, mockProducts } from '@/data/mockData';
import { Star, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { localizeReviews } from '@/lib/dynamicTranslations';

export default function AdminReviews() {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState(mockReviews);

  useEffect(() => {
    let active = true;
    localizeReviews(mockReviews, i18n.resolvedLanguage || i18n.language).then((items) => {
      if (active) setReviews(items);
    });
    return () => { active = false; };
  }, [i18n.resolvedLanguage, i18n.language]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-display font-bold text-foreground">{t('admin.reviews')}</h1><p className="text-sm font-body text-muted-foreground">{t('admin.reviewCount_other', { count: reviews.length })}</p></div>
      <div className="space-y-4">
        {reviews.map((review) => {
          const product = mockProducts.find((p) => p.id === review.product_id);
          return (
            <div key={review.id} className="admin-card"><div className="flex items-start justify-between gap-4"><div className="flex-1"><div className="flex items-center gap-2 mb-2"><span className="text-sm font-body font-semibold text-foreground">{review.user_name}</span>{review.is_verified && <span className="badge-status bg-success/10 text-success">{t('common.verified')}</span>}</div><div className="flex items-center gap-1 mb-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground/20'}`} />)}</div><h4 className="text-sm font-body font-medium text-foreground mb-1">{review.title}</h4><p className="text-sm font-body text-muted-foreground">{review.comment}</p><p className="text-xs font-body text-muted-foreground mt-2">{t('admin.product')}: {product?.title}</p></div><button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors flex-shrink-0" aria-label={t('common.remove')}><Trash2 className="w-4 h-4 text-muted-foreground" /></button></div></div>
          );
        })}
      </div>
    </div>
  );
}
