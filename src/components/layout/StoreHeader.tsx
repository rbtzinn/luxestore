import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, Menu, X, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { NavLink } from '@/components/NavLink';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

type HeaderIconLinkProps = {
  to: string;
  label: string;
  badge?: number;
  children: ReactNode;
};

const navLinkClassName = 'text-sm font-body font-medium transition-colors duration-200 tracking-wide text-muted-foreground hover:text-foreground';

function HeaderIconLink({ to, label, badge, children }: HeaderIconLinkProps) {
  return (
    <Link
      to={to}
      className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
      aria-label={label}
    >
      {children}
      {badge ? (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export default function StoreHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const navLinks = [
    { label: t('header.shop'), href: '/products' },
    { label: t('header.categories'), href: '/categories' },
    { label: t('header.about'), href: '/about' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container-premium">
          <div className="flex items-center justify-between h-16 md:h-20 gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-display font-bold tracking-tight text-foreground">LUXE</span>
              <span className="text-xs font-body font-light tracking-[0.3em] text-muted-foreground uppercase hidden sm:inline">Store</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink key={link.href} to={link.href} className={navLinkClassName} activeClassName="text-foreground">
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setSearchOpen((current) => !current)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t('common.search')}
              >
                <Search className="w-5 h-5" />
              </button>

              <HeaderIconLink to="/wishlist" label={t('common.wishlist')} badge={wishlistCount}>
                <Heart className="w-5 h-5" />
              </HeaderIconLink>

              <LanguageSwitcher />

              <HeaderIconLink to="/cart" label={t('common.cart')} badge={cartCount}>
                <ShoppingBag className="w-5 h-5" />
              </HeaderIconLink>

              <HeaderIconLink to="/auth" label={t('common.account')}>
                <User className="w-5 h-5" />
              </HeaderIconLink>

              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden"
                aria-label={t('header.menu')}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border/50 overflow-hidden"
            >
              <div className="container-premium py-4">
                <input type="search" placeholder={t('header.searchPlaceholder')} className="input-premium" autoFocus />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="container-premium py-4">
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-display font-bold text-foreground">LUXE</span>
                <button onClick={() => setMobileOpen(false)} className="p-2" aria-label={t('header.closeMenu')}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-3xl font-display font-medium text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/auth" className="text-3xl font-display font-medium text-foreground" onClick={() => setMobileOpen(false)}>
                  {t('common.account')}
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
