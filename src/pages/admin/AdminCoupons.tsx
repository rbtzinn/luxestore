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
import { mockCoupons } from '@/data/mockData';
import { formatCurrency } from '@/lib/locale';
import type { Coupon } from '@/types';

type CouponFormState = {
  code: string;
  description: string;
  discountType: Coupon['discount_type'];
  discountValue: string;
  minOrderValue: string;
  maxUses: string;
  usedCount: string;
  expiresAt: string;
  isActive: boolean;
};

function createFormState(coupon: Coupon): CouponFormState {
  return {
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discount_type,
    discountValue: String(coupon.discount_value),
    minOrderValue: String(coupon.min_order_value),
    maxUses: String(coupon.max_uses),
    usedCount: String(coupon.used_count),
    expiresAt: coupon.expires_at ?? '',
    isActive: coupon.is_active,
  };
}

export default function AdminCoupons() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [editableCoupons, setEditableCoupons] = useState<Coupon[]>([]);
  const [couponBeingEdited, setCouponBeingEdited] = useState<Coupon | null>(null);
  const [couponPendingDelete, setCouponPendingDelete] = useState<Coupon | null>(null);
  const [formState, setFormState] = useState<CouponFormState | null>(null);

  useEffect(() => {
    setEditableCoupons(mockCoupons);
  }, []);

  const handleEdit = (coupon: Coupon) => {
    setCouponBeingEdited(coupon);
    setFormState(createFormState(coupon));
  };

  const closeEditDialog = () => {
    setCouponBeingEdited(null);
    setFormState(null);
  };

  const updateFormField = <T extends keyof CouponFormState>(field: T, value: CouponFormState[T]) => {
    setFormState((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSaveCoupon = () => {
    if (!couponBeingEdited || !formState) return;

    setEditableCoupons((current) =>
      current.map((coupon) =>
        coupon.id === couponBeingEdited.id
          ? {
              ...coupon,
              code: formState.code.trim() || coupon.code,
              description: formState.description.trim() || coupon.description,
              discount_type: formState.discountType,
              discount_value: Number(formState.discountValue) || 0,
              min_order_value: Number(formState.minOrderValue) || 0,
              max_uses: Number(formState.maxUses) || 0,
              used_count: Math.max(0, Number(formState.usedCount) || 0),
              expires_at: formState.expiresAt.trim() || null,
              is_active: formState.isActive,
            }
          : coupon,
      ),
    );

    closeEditDialog();
  };

  const handleDeleteCoupon = () => {
    if (!couponPendingDelete) return;

    setEditableCoupons((current) => current.filter((coupon) => coupon.id !== couponPendingDelete.id));
    setCouponPendingDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{t('admin.coupons')}</h1>
            <p className="text-sm font-body text-muted-foreground">{t('admin.couponCount_other', { count: editableCoupons.length })}</p>
          </div>
          <button className="btn-premium" type="button">
            <Plus className="w-4 h-4" /> {t('admin.addCoupon')}
          </button>
        </div>
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.code')}</th>
                <th className="text-left py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">{t('admin.description')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.discount')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">{t('admin.used')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.status')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {editableCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-foreground">{coupon.code}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{coupon.description}</td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value, language)}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground hidden md:table-cell">
                    {coupon.used_count}/{coupon.max_uses}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`badge-status ${coupon.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {coupon.is_active ? t('admin.active') : t('admin.expired')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label={t('admin.actions')} type="button" onClick={() => handleEdit(coupon)}>
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" aria-label={t('common.remove')} type="button" onClick={() => setCouponPendingDelete(coupon)}>
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={Boolean(couponBeingEdited && formState)} onOpenChange={(open) => (!open ? closeEditDialog() : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{couponBeingEdited ? `Editar ${couponBeingEdited.code}` : 'Editar cupom'}</DialogTitle>
            <DialogDescription>Atualize os dados do cupom em modo local para revisar o fluxo do admin.</DialogDescription>
          </DialogHeader>

          {formState ? (
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.code')}</span>
                <input className="input-premium" value={formState.code} onChange={(event) => updateFormField('code', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.discount')}</span>
                <select className="input-premium" value={formState.discountType} onChange={(event) => updateFormField('discountType', event.target.value as Coupon['discount_type'])}>
                  <option value="percentage">Percentual</option>
                  <option value="fixed">Valor fixo</option>
                </select>
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.description')}</span>
                <textarea className="input-premium min-h-28 resize-y" value={formState.description} onChange={(event) => updateFormField('description', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Valor do desconto</span>
                <input className="input-premium" type="number" min="0" step="0.01" value={formState.discountValue} onChange={(event) => updateFormField('discountValue', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Pedido minimo</span>
                <input className="input-premium" type="number" min="0" step="0.01" value={formState.minOrderValue} onChange={(event) => updateFormField('minOrderValue', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Limite de uso</span>
                <input className="input-premium" type="number" min="0" step="1" value={formState.maxUses} onChange={(event) => updateFormField('maxUses', event.target.value)} />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('admin.used')}</span>
                <input className="input-premium" type="number" min="0" step="1" value={formState.usedCount} onChange={(event) => updateFormField('usedCount', event.target.value)} />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-xs font-body font-medium uppercase tracking-[0.14em] text-muted-foreground">Validade</span>
                <input className="input-premium" type="date" value={formState.expiresAt} onChange={(event) => updateFormField('expiresAt', event.target.value)} />
              </label>

              <label className="sm:col-span-2 flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('admin.status')}</p>
                  <p className="text-xs text-muted-foreground">Defina se o cupom aparece como ativo na tabela.</p>
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
            <button type="button" className="btn-premium" onClick={handleSaveCoupon}>
              Salvar alteracoes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(couponPendingDelete)} onOpenChange={(open) => (!open ? setCouponPendingDelete(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>
              {couponPendingDelete
                ? `Tem certeza que deseja remover o cupom ${couponPendingDelete.code}? Esta acao afeta apenas a lista local em modo demo.`
                : 'Tem certeza que deseja remover este cupom?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteCoupon}>
              Excluir cupom
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
