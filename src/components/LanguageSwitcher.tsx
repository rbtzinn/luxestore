import { Check, Globe2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLanguage, isChangingLanguage, changeLanguage } = useLanguage();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-2 h-auto w-auto rounded-none border-0 bg-transparent text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring data-[state=open]:bg-transparent data-[state=open]:text-foreground"
          aria-label={t('languageSwitcher.openMenu')}
        >
          {isChangingLanguage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe2 className="w-5 h-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-52">
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
