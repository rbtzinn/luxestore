import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockBanners } from '@/data/mockData';
import { localizeBanners } from '@/lib/dynamicTranslations';
import type { Banner } from '@/types';

type BannerFormState = {
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
  isActive: boolean;
};

function createFormState(banner: Banner): BannerFormState {
  return {
    title: banner.title,
    subtitle: banner.subtitle,
    imageUrl: banner.image_url,
    linkUrl: banner.link_url,
    position: String(banner.position),
    isActive: banner.is_active,
  };
}

export default function AdminBanners() {
  const { t, i18n } = useTranslation();
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [bannerBeingEdited, setBannerBeingEdited] = useState<Banner | null>(null);
  const [bannerPendingDelete, setBannerPendingDelete] = useState<Banner | null>(null);
  const [formState, setFormState] = useState<BannerFormState | null>(null);

  useEffect(() => {
    let active = true;

    localizeBanners(mockBanners, i18n.resolvedLanguage || i18n.language).then((items) => {
      if (active) {
        setBanners(items);
      }
    });

    return () => {
      active = false;
    };
  }, [i18n.resolvedLanguage, i18n.language]);

  const handleEdit = (banner: Banner) => {
    setBannerBeingEdited(banner);
    setFormState(createFormState(banner));
  };

  const closeEditDialog = () => {
    setBannerBeingEdited(null);
    setFormState(null);
  };

  const updateFormField = <T extends keyof BannerFormState>(field: T, value: BannerFormState[T]) => {
    setFormState((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSaveBanner = () => {
    if (!bannerBeingEdited || !formState) return;

    setBanners((current) =>
      current.map((banner) =>
        banner.id === bannerBeingEdited.id
          ? {
              ...banner,
              title: formState.title.trim() || banner.title,
              subtitle: formState.subtitle.trim() || banner.subtitle,
              image_url: formState.imageUrl.trim() || banner.image_url,
              link_url: formState.linkUrl.trim() || banner.link_url,
              position: Number(formState.position) || 0,
              is_active: formState.isActive,
            }
          : banner,
      ),
    );

    closeEditDialog();
  };

  const handleDeleteBanner = () => {
    if (!bannerPendingDelete) return;

    setBanners((current) => current.filter((banner) => banner.id !== bannerPendingDelete.id));
    setBannerPendingDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{t('admin.banners')}</h1>
            <p className="text-sm font-body text-muted-foreground">{t('admin.bannerCount_other', { count: banners.length })}</p>
          </div>
          <button className="btn-premium" type="button">
            <Plus className="w-4 h-4" /> {t('admin.addBanner')}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="admin-card overflow-hidden">
              <div className="aspect-[21/9] rounded-lg overflow-hidden mb-4">
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-body font-semibold text-foreground">{banner.title}</h3>
                  <p className="text-xs font-body text-muted-foreground">{banner.subtitle}</p>
                  <p className="mt-2 text-[11px] font-mono text-muted-foreground truncate">{banner.link_url}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label={t('admin.actions')} type="button" onClick={() => handleEdit(banner)}>
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" aria-label={t('common.remove')} type="button" onClick={() => setBannerPendingDelete(banner)}>
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(bannerBeingEdited && formState)} onOpenChange={(open) => (!open ? closeEditDialog() : null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{bannerBeingEdited ? `Editar ${bannerBeingEdited.title}` : 'Editar banner'}</DialogTitle>
            <DialogDescription>Atualize os dados do banner em modo local para revisar o fluxo do admin.</DialogDescription>
          </DialogHeader>

          {formState ? (
            <div className="grid gap-4 py-2">
              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Titulo</span>
                <input className="input-premium" value={formState.title} onChange={(event) => updateFormField('title', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Subtitulo</span>
                <input className="input-premium" value={formState.subtitle} onChange={(event) => updateFormField('subtitle', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Imagem</span>
                <input className="input-premium" value={formState.imageUrl} onChange={(event) => updateFormField('imageUrl', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Link</span>
                <input className="input-premium" value={formState.linkUrl} onChange={(event) => updateFormField('linkUrl', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Posicao</span>
                <input className="input-premium" type="number" min="0" step="1" value={formState.position} onChange={(event) => updateFormField('position', event.target.value)} />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('admin.status')}</p>
                  <p className="text-xs text-muted-foreground">Defina se o banner aparece como ativo.</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateFormField('isActive', !formState.isActive)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${formState.isActive ? 'bg-success' : 'bg-muted'}`}
                  aria-pressed={formState.isActive}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formState.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
            </div>
          ) : null}

          <DialogFooter>
            <button type="button" className="btn-premium-outline" onClick={closeEditDialog}>
              Cancelar
            </button>
            <button type="button" className="btn-premium" onClick={handleSaveBanner}>
              Salvar alteracoes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(bannerPendingDelete)} onOpenChange={(open) => (!open ? setBannerPendingDelete(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>
              {bannerPendingDelete
                ? `Tem certeza que deseja remover ${bannerPendingDelete.title}? Esta acao afeta apenas a lista local em modo demo.`
                : 'Tem certeza que deseja remover este banner?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteBanner}>
              Excluir banner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
