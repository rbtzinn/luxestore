import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockProducts } from '@/data/mockData';
import { useProducts } from '@/hooks/useCatalog';
import { formatCurrency } from '@/lib/locale';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const { data: productsData = [] } = useProducts();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const baseProducts = productsData.length ? productsData : mockProducts;
  const products = useMemo(() => baseProducts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())), [baseProducts, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-display font-bold text-foreground">{t('admin.products')}</h1><p className="text-sm font-body text-muted-foreground">{t('admin.productCount_other', { count: products.length })}</p></div>
        <button className="btn-premium" type="button"><Plus className="w-4 h-4" /> {t('common.demoMode')}</button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.searchProducts')} className="input-premium pl-10" />
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.product')}</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">{t('admin.sku')}</th>
              <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.price')}</th>
              <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.stock')}</th>
              <th className="text-center py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.status')}</th>
              <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }} className="border-b border-border/50 last:border-0">
                <td className="py-4 px-4"><div className="flex items-center gap-3 min-w-[220px]"><div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">{product.images[0]?.url ? <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-muted-foreground" /></div>}</div><div><p className="font-medium text-foreground">{product.title}</p><p className="text-xs text-muted-foreground">{product.brand}</p></div></div></td>
                <td className="py-4 px-4 text-muted-foreground hidden md:table-cell">{product.sku}</td>
                <td className="py-4 px-4 text-right font-medium text-foreground">{formatCurrency(product.sale_price ?? product.price, language)}</td>
                <td className="py-4 px-4 text-right text-muted-foreground">{product.stock}</td>
                <td className="py-4 px-4 text-center"><span className={`badge-status ${product.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{product.is_active ? t('admin.active') : t('admin.inactive')}</span></td>
                <td className="py-4 px-4"><div className="flex items-center justify-end gap-1"><button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label={t('admin.actions')} type="button"><Edit2 className="w-4 h-4 text-muted-foreground" /></button><button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" aria-label={t('common.remove')} type="button"><Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" /></button></div></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
