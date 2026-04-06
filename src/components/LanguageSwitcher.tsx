import { Check, ChevronDown, Globe2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLanguage, isChangingLanguage, changeLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full border border-border/60 bg-background/80 backdrop-blur-sm hover:bg-secondary/70"
          aria-label={t('languageSwitcher.openMenu')}
        >
          {isChangingLanguage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe2 className="w-4 h-4" />}
          <ChevronDown className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-background text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{t('languageSwitcher.current')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => changeLanguage('pt-BR')} className="cursor-pointer justify-between">
          <span className="flex items-center gap-2">
            <span aria-hidden="true">🇧🇷</span>
            {t('languageSwitcher.portuguese')}
          </span>
          {currentLanguage === 'pt-BR' && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer justify-between">
          <span className="flex items-center gap-2">
            <span aria-hidden="true">🇺🇸</span>
            {t('languageSwitcher.english')}
          </span>
          {currentLanguage === 'en' && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
