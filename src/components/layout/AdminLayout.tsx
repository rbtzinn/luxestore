import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Tag, Image, Star, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = useMemo(
    () => [
      { label: t('admin.dashboard'), href: '/admin', icon: LayoutDashboard },
      { label: t('admin.products'), href: '/admin/products', icon: Package },
      { label: t('admin.categories'), href: '/admin/categories', icon: FolderTree },
      { label: t('admin.orders'), href: '/admin/orders', icon: ShoppingCart },
      { label: t('admin.customers'), href: '/admin/customers', icon: Users },
      { label: t('admin.coupons'), href: '/admin/coupons', icon: Tag },
      { label: t('admin.banners'), href: '/admin/banners', icon: Image },
      { label: t('admin.reviews'), href: '/admin/reviews', icon: Star },
    ],
    [t],
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-lg font-display font-bold text-foreground">LUXE</span>
            <span className="text-[10px] font-body tracking-widest uppercase text-muted-foreground">{t('common.admin')}</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground" aria-label={t('header.closeMenu')}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <LogOut className="w-4 h-4" />
            {t('admin.backToStore')}
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-primary/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-muted-foreground mr-3" aria-label={t('header.menu')}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground transition-colors">{t('common.admin')}</Link>
            {location.pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground capitalize">{navItems.find((item) => location.pathname.startsWith(item.href))?.label}</span>
              </>
            )}
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
