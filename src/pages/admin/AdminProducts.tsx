import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Package } from 'lucide-react';
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
import { mockCategories, mockProducts } from '@/data/mockData';
import { useCategories, useProducts } from '@/hooks/useCatalog';
import { formatCurrency } from '@/lib/locale';
import type { Product } from '@/types';

type ProductFormState = {
  title: string;
  brand: string;
  sku: string;
  price: string;
  salePrice: string;
  stock: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
};

function createFormState(product: Product): ProductFormState {
  return {
    title: product.title,
    brand: product.brand,
    sku: product.sku,
    price: String(product.price),
    salePrice: product.sale_price ? String(product.sale_price) : '',
    stock: String(product.stock),
    description: product.description,
    categoryId: product.category_id,
    imageUrl: product.images[0]?.url ?? '',
    isActive: product.is_active,
  };
}

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [editableProducts, setEditableProducts] = useState<Product[]>([]);
  const [productBeingEdited, setProductBeingEdited] = useState<Product | null>(null);
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);
  const [formState, setFormState] = useState<ProductFormState | null>(null);
  const { data: productsData = [] } = useProducts();
  const { data: categoriesData = [] } = useCategories();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const baseProducts = productsData.length ? productsData : mockProducts;
  const categories = categoriesData.length ? categoriesData : mockCategories;

  useEffect(() => {
    setEditableProducts(baseProducts);
  }, [baseProducts]);

  const products = useMemo(() => {
    const query = search.toLowerCase();

    return editableProducts.filter((product) =>
      [product.title, product.sku, product.brand].some((value) => value.toLowerCase().includes(query)),
    );
  }, [editableProducts, search]);

  const handleEdit = (product: Product) => {
    setProductBeingEdited(product);
    setFormState(createFormState(product));
  };

  const closeEditDialog = () => {
    setProductBeingEdited(null);
    setFormState(null);
  };

  const updateFormField = <T extends keyof ProductFormState>(field: T, value: ProductFormState[T]) => {
    setFormState((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSaveProduct = () => {
    if (!productBeingEdited || !formState) return;

    const category = categories.find((item) => item.id === formState.categoryId) ?? productBeingEdited.category;
    const normalizedPrice = Number(formState.price) || 0;
    const normalizedSalePrice = formState.salePrice.trim() ? Number(formState.salePrice) || 0 : null;
    const normalizedStock = Math.max(0, Number(formState.stock) || 0);

    setEditableProducts((current) =>
      current.map((product) => {
        if (product.id !== productBeingEdited.id) {
          return product;
        }

        const nextImageUrl = formState.imageUrl.trim() || product.images[0]?.url || '';
        const nextImage = nextImageUrl
          ? [{ ...(product.images[0] ?? { id: `${product.id}-image-0`, product_id: product.id, alt: formState.title, position: 0 }), url: nextImageUrl, alt: formState.title }]
          : product.images;

        return {
          ...product,
          title: formState.title.trim() || product.title,
          brand: formState.brand.trim() || product.brand,
          sku: formState.sku.trim() || product.sku,
          price: normalizedPrice,
          sale_price: normalizedSalePrice,
          stock: normalizedStock,
          description: formState.description.trim() || product.description,
          category_id: formState.categoryId,
          category,
          images: nextImage,
          is_active: formState.isActive,
          updated_at: new Date().toISOString(),
        };
      }),
    );

    closeEditDialog();
  };

  const handleDeleteProduct = () => {
    if (!productPendingDelete) return;

    setEditableProducts((current) => current.filter((product) => product.id !== productPendingDelete.id));
    setProductPendingDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{t('admin.products')}</h1>
            <p className="text-sm font-body text-muted-foreground">{t('admin.productCount_other', { count: products.length })}</p>
          </div>
          <button className="btn-premium" type="button">
            <Plus className="w-4 h-4" /> {t('common.demoMode')}
          </button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('admin.searchProducts')} className="input-premium pl-10" />
        </div>

        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.product')}</th>
                <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">{t('admin.sku')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.price')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.stock')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.status')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }} className="border-b border-border/50 last:border-0">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        {product.images[0]?.url ? (
                          <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.title}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground hidden md:table-cell">{product.sku}</td>
                  <td className="py-4 px-4 text-right font-medium text-foreground">{formatCurrency(product.sale_price ?? product.price, language)}</td>
                  <td className="py-4 px-4 text-right text-muted-foreground">{product.stock}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`badge-status ${product.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {product.is_active ? t('admin.active') : t('admin.inactive')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label={t('admin.actions')} type="button" onClick={() => handleEdit(product)}>
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" aria-label={t('common.remove')} type="button" onClick={() => setProductPendingDelete(product)}>
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={Boolean(productBeingEdited && formState)} onOpenChange={(open) => (!open ? closeEditDialog() : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{productBeingEdited ? `Editar ${productBeingEdited.title}` : 'Editar produto'}</DialogTitle>
            <DialogDescription>
              Atualize os dados do produto em modo local para revisar o layout e o fluxo de administracao.
            </DialogDescription>
          </DialogHeader>

          {formState ? (
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.product')}</span>
                <input className="input-premium" value={formState.title} onChange={(event) => updateFormField('title', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('productPage.brand')}</span>
                <input className="input-premium" value={formState.brand} onChange={(event) => updateFormField('brand', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.sku')}</span>
                <input className="input-premium" value={formState.sku} onChange={(event) => updateFormField('sku', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.price')}</span>
                <input className="input-premium" type="number" min="0" step="0.01" value={formState.price} onChange={(event) => updateFormField('price', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Preco promocional</span>
                <input className="input-premium" type="number" min="0" step="0.01" value={formState.salePrice} onChange={(event) => updateFormField('salePrice', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.stock')}</span>
                <input className="input-premium" type="number" min="0" step="1" value={formState.stock} onChange={(event) => updateFormField('stock', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('productPage.category')}</span>
                <select className="input-premium" value={formState.categoryId} onChange={(event) => updateFormField('categoryId', event.target.value)}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Imagem principal</span>
                <input className="input-premium" value={formState.imageUrl} onChange={(event) => updateFormField('imageUrl', event.target.value)} />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.description')}</span>
                <textarea className="input-premium min-h-32 resize-y" value={formState.description} onChange={(event) => updateFormField('description', event.target.value)} />
              </label>

              <label className="sm:col-span-2 flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('admin.status')}</p>
                  <p className="text-xs text-muted-foreground">Defina se o produto aparece como ativo na tabela.</p>
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
            <button type="button" className="btn-premium" onClick={handleSaveProduct}>
              Salvar alteracoes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(productPendingDelete)} onOpenChange={(open) => (!open ? setProductPendingDelete(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>
              {productPendingDelete
                ? `Tem certeza que deseja remover ${productPendingDelete.title}? Esta acao afeta apenas a lista local em modo demo.`
                : 'Tem certeza que deseja remover este produto?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteProduct}>
              Excluir produto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
