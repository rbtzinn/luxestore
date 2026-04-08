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
import { mockCategories } from '@/data/mockData';
import { useCategories } from '@/hooks/useCatalog';
import type { Category } from '@/types';

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

function createFormState(category: Category): CategoryFormState {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.image_url ?? '',
    isActive: category.is_active,
  };
}

export default function AdminCategories() {
  const { data: categoriesData = [] } = useCategories();
  const { t } = useTranslation();
  const [editableCategories, setEditableCategories] = useState<Category[]>([]);
  const [categoryBeingEdited, setCategoryBeingEdited] = useState<Category | null>(null);
  const [categoryPendingDelete, setCategoryPendingDelete] = useState<Category | null>(null);
  const [formState, setFormState] = useState<CategoryFormState | null>(null);
  const categories = categoriesData.length ? categoriesData : mockCategories;

  useEffect(() => {
    setEditableCategories(categories);
  }, [categories]);

  const handleEdit = (category: Category) => {
    setCategoryBeingEdited(category);
    setFormState(createFormState(category));
  };

  const closeEditDialog = () => {
    setCategoryBeingEdited(null);
    setFormState(null);
  };

  const updateFormField = <T extends keyof CategoryFormState>(field: T, value: CategoryFormState[T]) => {
    setFormState((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSaveCategory = () => {
    if (!categoryBeingEdited || !formState) return;

    setEditableCategories((current) =>
      current.map((category) =>
        category.id === categoryBeingEdited.id
          ? {
              ...category,
              name: formState.name.trim() || category.name,
              slug: formState.slug.trim() || category.slug,
              description: formState.description.trim() || category.description,
              image_url: formState.imageUrl.trim() || null,
              is_active: formState.isActive,
            }
          : category,
      ),
    );

    closeEditDialog();
  };

  const handleDeleteCategory = () => {
    if (!categoryPendingDelete) return;

    setEditableCategories((current) => current.filter((category) => category.id !== categoryPendingDelete.id));
    setCategoryPendingDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{t('admin.categories')}</h1>
            <p className="text-sm font-body text-muted-foreground">{t('admin.categoryCount_other', { count: editableCategories.length })}</p>
          </div>
          <button className="btn-premium" type="button">
            <Plus className="w-4 h-4" /> {t('common.demoMode')}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {editableCategories.map((category) => (
            <div key={category.id} className="admin-card flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                <img src={category.image_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80'} alt={category.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-body font-semibold text-foreground">{category.name}</h3>
                <p className="text-xs font-body text-muted-foreground truncate">{category.description}</p>
                <p className="mt-2 text-[11px] font-mono text-muted-foreground">{category.slug}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label={t('admin.actions')} type="button" onClick={() => handleEdit(category)}>
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" aria-label={t('common.remove')} type="button" onClick={() => setCategoryPendingDelete(category)}>
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(categoryBeingEdited && formState)} onOpenChange={(open) => (!open ? closeEditDialog() : null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{categoryBeingEdited ? `Editar ${categoryBeingEdited.name}` : 'Editar categoria'}</DialogTitle>
            <DialogDescription>Atualize os dados da categoria em modo local para revisar o fluxo do admin.</DialogDescription>
          </DialogHeader>

          {formState ? (
            <div className="grid gap-4 py-2">
              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Nome</span>
                <input className="input-premium" value={formState.name} onChange={(event) => updateFormField('name', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Slug</span>
                <input className="input-premium" value={formState.slug} onChange={(event) => updateFormField('slug', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.description')}</span>
                <textarea className="input-premium min-h-28 resize-y" value={formState.description} onChange={(event) => updateFormField('description', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Imagem</span>
                <input className="input-premium" value={formState.imageUrl} onChange={(event) => updateFormField('imageUrl', event.target.value)} />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('admin.status')}</p>
                  <p className="text-xs text-muted-foreground">Defina se a categoria aparece como ativa.</p>
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
            <button type="button" className="btn-premium" onClick={handleSaveCategory}>
              Salvar alteracoes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(categoryPendingDelete)} onOpenChange={(open) => (!open ? setCategoryPendingDelete(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryPendingDelete
                ? `Tem certeza que deseja remover ${categoryPendingDelete.name}? Esta acao afeta apenas a lista local em modo demo.`
                : 'Tem certeza que deseja remover esta categoria?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteCategory}>
              Excluir categoria
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
