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
import { showAddedToCartToast } from '@/lib/cartFeedback';
import { useCartStore } from '@/store/cartStore';

export default function DuplicateCartDialog() {
  const duplicatePending = useCartStore((state) => state.duplicatePending);
  const confirmDuplicateAdd = useCartStore((state) => state.confirmDuplicateAdd);
  const cancelDuplicateAdd = useCartStore((state) => state.cancelDuplicateAdd);

  const handleConfirm = () => {
    if (duplicatePending) {
      showAddedToCartToast(duplicatePending.product, duplicatePending.quantity);
    }

    confirmDuplicateAdd();
  };

  return (
    <AlertDialog open={Boolean(duplicatePending)} onOpenChange={(open) => (!open ? cancelDuplicateAdd() : null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Este item já está no carrinho</AlertDialogTitle>
          <AlertDialogDescription>
            {duplicatePending
              ? `${duplicatePending.product.title} já foi adicionado. Deseja somar mais ${duplicatePending.quantity} unidade(s) ao carrinho?`
              : 'Este item já está no carrinho. Deseja adicionar mais uma unidade?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Adicionar mesmo assim</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
