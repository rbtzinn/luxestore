import { mockBanners } from '@/data/mockData';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { localizeBanners } from '@/lib/dynamicTranslations';

export default function AdminBanners() {
  const { t, i18n } = useTranslation();
  const [banners, setBanners] = useState(mockBanners);

  useEffect(() => {
    let active = true;
    localizeBanners(mockBanners, i18n.resolvedLanguage || i18n.language).then((items) => {
      if (active) setBanners(items);
    });
    return () => { active = false; };
  }, [i18n.resolvedLanguage, i18n.language]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-foreground">{t('admin.banners')}</h1><p className="text-sm font-body text-muted-foreground">{t('admin.bannerCount_other', { count: banners.length })}</p></div>
        <button className="btn-premium"><Plus className="w-4 h-4" /> {t('admin.addBanner')}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="admin-card overflow-hidden"><div className="aspect-[21/9] rounded-lg overflow-hidden mb-4"><img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" /></div><div className="flex items-center justify-between"><div><h3 className="text-sm font-body font-semibold text-foreground">{banner.title}</h3><p className="text-xs font-body text-muted-foreground">{banner.subtitle}</p></div><div className="flex gap-1"><button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label={t('admin.actions')}><Edit2 className="w-4 h-4 text-muted-foreground" /></button><button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" aria-label={t('common.remove')}><Trash2 className="w-4 h-4 text-muted-foreground" /></button></div></div></div>
        ))}
      </div>
    </div>
  );
}
