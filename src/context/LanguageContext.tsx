import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { normalizeLanguage, type AppLanguage } from '@/lib/locale';

type LanguageContextValue = {
  currentLanguage: AppLanguage;
  isChangingLanguage: boolean;
  changeLanguage: (language: AppLanguage) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<AppLanguage>(normalizeLanguage(i18n.resolvedLanguage));

  const changeLanguage = async (language: AppLanguage) => {
    const nextLanguage = normalizeLanguage(language);
    const current = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
    if (nextLanguage === current) return;

    setPendingLanguage(nextLanguage);
    setIsChangingLanguage(true);
    const startedAt = Date.now();

    try {
      await i18n.changeLanguage(nextLanguage);
      localStorage.setItem('lang', nextLanguage);
    } finally {
      const elapsed = Date.now() - startedAt;
      const delay = Math.max(0, 500 - elapsed);
      await new Promise((resolve) => window.setTimeout(resolve, delay));
      setIsChangingLanguage(false);
    }
  };

  const value = useMemo(() => ({
    currentLanguage: normalizeLanguage(i18n.resolvedLanguage || i18n.language),
    isChangingLanguage,
    changeLanguage,
  }), [isChangingLanguage, i18n.resolvedLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {isChangingLanguage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-md">
          <div className="glass-card px-6 py-5 flex items-center gap-3 shadow-2xl">
            <Loader2 className="w-5 h-5 animate-spin text-foreground" />
            <div>
              <p className="text-sm font-body font-medium text-foreground">
                {t('common.loadingLanguage')}
              </p>
              <p className="text-xs font-body text-muted-foreground mt-1">
                {t('languageSwitcher.switchingTo', {
                  language: pendingLanguage === 'pt-BR' ? t('languageSwitcher.portuguese') : t('languageSwitcher.english'),
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
