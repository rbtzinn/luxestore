import i18n from '@/i18n';

export type AppLanguage = 'pt-BR' | 'en';

export function normalizeLanguage(value?: string): AppLanguage {
  return value?.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}

export function getAppLanguage(): AppLanguage {
  return normalizeLanguage(i18n.resolvedLanguage || i18n.language);
}

export function getLocale(value?: string) {
  return normalizeLanguage(value) === 'pt-BR' ? 'pt-BR' : 'en-US';
}

export function formatCurrency(value: number, language?: string) {
  return new Intl.NumberFormat(getLocale(language), {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | number | Date, language?: string) {
  return new Intl.DateTimeFormat(getLocale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}
