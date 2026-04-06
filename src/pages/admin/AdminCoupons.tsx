import { mockCoupons } from '@/data/mockData';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translateTexts } from '@/lib/dynamicTranslations';
import { formatCurrency } from '@/lib/locale';

export default function AdminCoupons() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [descriptions, setDescriptions] = useState(mockCoupons.map((coupon) => coupon.description));

  useEffect(() => {
    let active = true;
    translateTexts(mockCoupons.map((coupon) => coupon.description), language).then((items) => {
      if (active) setDescriptions(items);
    });
    return () => { active = false; };
  }, [language]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-foreground">{t('admin.coupons')}</h1><p className="text-sm font-body text-muted-foreground">{t('admin.couponCount_other', { count: mockCoupons.length })}</p></div>
        <button className="btn-premium"><Plus className="w-4 h-4" /> {t('admin.addCoupon')}</button>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b border-border"><th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.code')}</th><th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">{t('admin.description')}</th><th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.discount')}</th><th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">{t('admin.used')}</th><th className="text-center py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.status')}</th><th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.actions')}</th></tr></thead>
          <tbody>
            {mockCoupons.map((coupon, index) => (
              <tr key={coupon.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-foreground">{coupon.code}</td>
                <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{descriptions[index] || coupon.description}</td>
                <td className="py-3 px-4 text-right text-foreground">{coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value, language)}</td>
                <td className="py-3 px-4 text-right text-muted-foreground hidden md:table-cell">{coupon.used_count}/{coupon.max_uses}</td>
                <td className="py-3 px-4 text-center"><span className={`badge-status ${coupon.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{coupon.is_active ? t('admin.active') : t('admin.expired')}</span></td>
                <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-2"><button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label={t('admin.actions')}><Edit2 className="w-4 h-4 text-muted-foreground" /></button><button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" aria-label={t('common.remove')}><Trash2 className="w-4 h-4 text-muted-foreground" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
