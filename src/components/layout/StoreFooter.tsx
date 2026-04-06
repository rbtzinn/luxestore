import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function StoreFooter() {
  const { t } = useTranslation();

  const footerLinks = useMemo(
    () => ({
      shop: [
        { label: t('footer.allProducts'), href: '/products' },
        { label: t('common.categories'), href: '/categories' },
        { label: t('footer.newArrivals'), href: '/products?sort=newest' },
        { label: t('footer.sale'), href: '/products?sale=true' },
      ],
      support: [
        { label: t('footer.contact'), href: '/contact' },
        { label: t('footer.shippingReturns'), href: '/shipping' },
        { label: t('footer.faq'), href: '/faq' },
        { label: t('footer.sizeGuide'), href: '/size-guide' },
      ],
      company: [
        { label: t('footer.aboutLuxe'), href: '/about' },
        { label: t('footer.careers'), href: '/careers' },
        { label: t('footer.press'), href: '/press' },
        { label: t('footer.sustainability'), href: '/sustainability' },
      ],
    }),
    [t],
  );

  const sectionLabels = {
    shop: t('footer.shop'),
    support: t('footer.support'),
    company: t('footer.company'),
  } as const;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-premium py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold tracking-tight">LUXE</span>
            </Link>
            <p className="text-sm text-primary-foreground/60 font-body leading-relaxed max-w-xs">{t('footer.description')}</p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-body font-semibold tracking-[0.2em] uppercase mb-4 text-primary-foreground/40">
                {sectionLabels[section as keyof typeof sectionLabels]}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm font-body text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40 font-body">
            © {new Date().getFullYear()} LUXE Store. {t('footer.rights')}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-primary-foreground/40 hover:text-primary-foreground/60 font-body transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="text-xs text-primary-foreground/40 hover:text-primary-foreground/60 font-body transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
