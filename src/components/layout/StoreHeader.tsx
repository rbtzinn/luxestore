import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe2, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

type HeaderIconLinkProps = {
  to: string;
  label: string;
  badge?: number;
  children: ReactNode;
  className?: string;
};

const navLinkClassName =
  'text-sm font-body font-medium transition-colors duration-200 tracking-wide text-muted-foreground hover:text-foreground';

function HeaderIconLink({ to, label, badge, children, className }: HeaderIconLinkProps) {
  return (
    <Link
      to={to}
      className={`relative p-2 text-muted-foreground transition-colors hover:text-foreground ${className ?? ''}`}
      aria-label={label}
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function MobileMenuLink({
  to,
  label,
  icon,
  badge,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3 text-sm font-body font-medium text-foreground"
      onClick={onNavigate}
    >
      <span>{label}</span>
      <span className="flex items-center gap-3">
        {badge ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-bold text-background">
            {badge}
          </span>
        ) : null}
        {icon}
      </span>
    </Link>
  );
}

export default function StoreHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const accountPath = isAuthenticated ? '/profile' : '/auth';

  const navLinks = [
    { label: t('header.shop'), href: '/products' },
    { label: t('header.categories'), href: '/categories' },
    { label: t('header.about'), href: '/about' },
  ];

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-colors duration-500">
        <div className="container-premium">
          <div className="flex h-16 items-center justify-between gap-3 md:h-20">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground md:text-2xl font-display">LUXE</span>
              <span className="hidden text-xs font-body font-light uppercase tracking-[0.3em] text-muted-foreground sm:inline">
                Store
              </span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <NavLink key={link.href} to={link.href} className={navLinkClassName} activeClassName="text-foreground">
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1 md:gap-3">
              <button
                onClick={() => setSearchOpen((current) => !current)}
                className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={t('common.search')}
              >
                <Search className="h-5 w-5" />
              </button>

              <div className="hidden md:block">
                <HeaderIconLink to="/wishlist" label={t('common.wishlist')} badge={wishlistCount}>
                  <Heart className="h-5 w-5" />
                </HeaderIconLink>
              </div>

              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              <HeaderIconLink to="/cart" label={t('common.cart')} badge={cartCount}>
                <ShoppingBag className="h-5 w-5" />
              </HeaderIconLink>

              <div className="hidden md:block">
                <HeaderIconLink to={accountPath} label={t('common.account')}>
                  <User className="h-5 w-5" />
                </HeaderIconLink>
              </div>

              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
                aria-label={t('header.menu')}
              >
                <Menu className="h-5 w-5" />
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
              className="overflow-hidden border-t border-border/50"
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
            <div className="container-premium flex min-h-dvh flex-col py-4">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-xl font-bold text-foreground font-display">LUXE</span>
                <button onClick={closeMobileMenu} className="p-2" aria-label={t('header.closeMenu')}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-5 border-b border-border/60 pb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-3xl font-display font-medium text-foreground"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 py-8">
                <MobileMenuLink
                  to={accountPath}
                  label={t('common.account')}
                  icon={<User className="h-4 w-4" />}
                  onNavigate={closeMobileMenu}
                />
                <MobileMenuLink
                  to="/wishlist"
                  label={t('common.wishlist')}
                  icon={<Heart className="h-4 w-4" />}
                  badge={wishlistCount}
                  onNavigate={closeMobileMenu}
                />
                <MobileMenuLink
                  to="/cart"
                  label={t('common.cart')}
                  icon={<ShoppingBag className="h-4 w-4" />}
                  badge={cartCount}
                  onNavigate={closeMobileMenu}
                />

                <div className="rounded-2xl border border-border/70 px-4 py-3">
                  <div className="mb-3 flex items-center gap-2 text-sm font-body font-medium text-foreground">
                    <Globe2 className="h-4 w-4" />
                    <span>{t('languageSwitcher.current')}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => changeLanguage('pt-BR')}
                      className={`rounded-full px-4 py-2 text-xs font-body font-semibold transition-colors ${
                        currentLanguage === 'pt-BR'
                          ? 'bg-foreground text-background'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      PT-BR
                    </button>
                    <button
                      type="button"
                      onClick={() => changeLanguage('en')}
                      className={`rounded-full px-4 py-2 text-xs font-body font-semibold transition-colors ${
                        currentLanguage === 'en'
                          ? 'bg-foreground text-background'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen((current) => !current);
                    closeMobileMenu();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-border/70 px-5 py-3 text-sm font-body font-medium text-foreground"
                >
                  <Search className="h-4 w-4" />
                  {t('common.search')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
