import { Plus, Edit2, Trash2 } from 'lucide-react';
import { mockCategories } from '@/data/mockData';
import { useCategories } from '@/hooks/useCatalog';
import { useTranslation } from 'react-i18next';

export default function AdminCategories() {
  const { data: categoriesData = [] } = useCategories();
  const categories = categoriesData.length ? categoriesData : mockCategories;
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-foreground">{t('admin.categories')}</h1><p className="text-sm font-body text-muted-foreground">{t('admin.categoryCount_other', { count: categories.length })}</p></div>
        <button className="btn-premium" type="button"><Plus className="w-4 h-4" /> {t('common.demoMode')}</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="admin-card flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0"><img src={cat.image_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80'} alt={cat.name} className="w-full h-full object-cover" /></div>
            <div className="flex-1 min-w-0"><h3 className="text-sm font-body font-semibold text-foreground">{cat.name}</h3><p className="text-xs font-body text-muted-foreground truncate">{cat.description}</p></div>
            <div className="flex gap-1"><button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label={t('admin.actions')} type="button"><Edit2 className="w-4 h-4 text-muted-foreground" /></button><button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" aria-label={t('common.remove')} type="button"><Trash2 className="w-4 h-4 text-muted-foreground" /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
