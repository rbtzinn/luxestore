import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '@/lib/locale';

const mockCustomers = [
  { id: '1', name: 'Alexandra Mitchell', email: 'alexandra@email.com', orders: 12, total_spent: 4890, joined: '2024-01-15' },
  { id: '2', name: 'Marcus Thompson', email: 'marcus@email.com', orders: 8, total_spent: 3200, joined: '2024-01-20' },
  { id: '3', name: 'Sophie Laurent', email: 'sophie@email.com', orders: 5, total_spent: 1890, joined: '2024-02-01' },
  { id: '4', name: 'Daniel Kim', email: 'daniel@email.com', orders: 3, total_spent: 980, joined: '2024-02-10' },
  { id: '5', name: 'Isabella Rossi', email: 'isabella@email.com', orders: 15, total_spent: 7200, joined: '2023-12-05' },
];

export default function AdminCustomers() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-display font-bold text-foreground">{t('admin.customers')}</h1><p className="text-sm font-body text-muted-foreground">{t('admin.customerCount_other', { count: mockCustomers.length })}</p></div>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b border-border"><th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.customer')}</th><th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.orders')}</th><th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.totalSpent')}</th><th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">{t('admin.joined')}</th></tr></thead>
          <tbody>
            {mockCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors"><td className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><span className="text-xs font-body font-semibold text-secondary-foreground">{customer.name.charAt(0)}</span></div><div><p className="font-medium text-foreground">{customer.name}</p><p className="text-xs text-muted-foreground">{customer.email}</p></div></div></td><td className="py-3 px-4 text-right text-foreground">{customer.orders}</td><td className="py-3 px-4 text-right font-semibold text-foreground">{formatCurrency(customer.total_spent, language)}</td><td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{formatDate(customer.joined, language)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
