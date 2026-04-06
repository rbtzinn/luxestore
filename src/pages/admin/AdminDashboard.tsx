import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockDashboardStats, mockProducts, mockOrders } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '@/lib/locale';

const stats = mockDashboardStats;
const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-info/10 text-info',
  processing: 'bg-info/10 text-info',
  shipped: 'bg-accent/10 text-accent',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const kpiCards = [
    { label: t('admin.totalRevenue'), value: formatCurrency(stats.total_revenue, language), change: '+12.5%', icon: DollarSign, positive: true },
    { label: t('admin.totalOrders'), value: stats.total_orders.toString(), change: '+8.2%', icon: ShoppingCart, positive: true },
    { label: t('admin.avgTicket'), value: formatCurrency(stats.avg_ticket, language), change: '+3.1%', icon: TrendingUp, positive: true },
    { label: t('admin.customers'), value: stats.total_customers.toString(), change: '+15.4%', icon: Users, positive: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-1">{t('admin.dashboard')}</h1>
        <p className="text-sm font-body text-muted-foreground">{t('admin.overview')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"><kpi.icon className="w-5 h-5 text-foreground" /></div>
              <span className={`text-xs font-body font-medium flex items-center gap-0.5 ${kpi.positive ? 'text-success' : 'text-destructive'}`}>{kpi.change}<ArrowUpRight className="w-3 h-3" /></span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs font-body text-muted-foreground mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">{t('admin.revenueTrend')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.revenue_by_day}>
              <defs><linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.1} /><stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(value: number) => [formatCurrency(value, language), t('admin.totalRevenue')]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--foreground))" fillOpacity={1} fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">{t('admin.topProducts')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.top_products.map((p) => ({ name: p.product.title.split(' ').slice(0, 2).join(' '), sold: p.total_sold }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="sold" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-display font-semibold text-foreground">{t('admin.recentOrders')}</h3><Link to="/admin/orders" className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors">{t('admin.viewAll')} →</Link></div>
          <div className="space-y-3">
            {mockOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div><p className="text-sm font-body font-medium text-foreground">{order.id}</p><p className="text-xs font-body text-muted-foreground">{formatDate(order.created_at, language)}</p></div>
                <div className="flex items-center gap-3"><span className={`badge-status ${statusColors[order.status] || ''}`}>{t(`orderStatus.${order.status}`)}</span><span className="text-sm font-body font-semibold text-foreground">{formatCurrency(order.total, language)}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-display font-semibold text-foreground">{t('admin.lowStock')}</h3><Link to="/admin/products" className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors">{t('admin.viewAll')} →</Link></div>
          <div className="space-y-3">
            {mockProducts.filter((p) => p.stock < 25).map((product) => (
              <div key={product.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0"><img src={product.images[0]?.url} alt={product.title} className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-body font-medium text-foreground truncate">{product.title}</p><p className="text-xs font-body text-muted-foreground">{product.sku}</p></div>
                <div className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-warning" /><span className="text-sm font-body font-semibold text-warning">{product.stock}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
