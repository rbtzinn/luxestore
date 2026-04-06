import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { mockOrders } from '@/data/mockData';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '@/lib/locale';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-info/10 text-info',
  processing: 'bg-info/10 text-info',
  shipped: 'bg-accent/10 text-accent',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const orders = mockOrders.filter((o) => o.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-display font-bold text-foreground">{t('admin.orders')}</h1><p className="text-sm font-body text-muted-foreground">{t('admin.orderCount_other', { count: orders.length })}</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.searchOrders')} className="input-premium pl-10" />
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.orders')}</th>
              <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">{t('admin.date')}</th>
              <th className="text-center py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.status')}</th>
              <th className="text-center py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">{t('admin.payment')}</th>
              <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('common.total')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{order.id}</td>
                <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{formatDate(order.created_at, language)}</td>
                <td className="py-3 px-4 text-center"><span className={`badge-status ${statusColors[order.status] || ''}`}>{t(`orderStatus.${order.status}`)}</span></td>
                <td className="py-3 px-4 text-center hidden md:table-cell"><span className={`badge-status ${order.payment_status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{t(`paymentStatus.${order.payment_status}`)}</span></td>
                <td className="py-3 px-4 text-right font-semibold text-foreground">{formatCurrency(order.total, language)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
