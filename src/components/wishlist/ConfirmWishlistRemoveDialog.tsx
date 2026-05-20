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
import { useWishlistStore } from '@/store/wishlistStore';
import { useTranslation } from 'react-i18next';
import { showWishlistToast } from '@/lib/cartFeedback';

export default function ConfirmWishlistRemoveDialog() {
  const { removalPending, confirmRemove, cancelRemove } = useWishlistStore();
  const { t } = useTranslation();

  const handleConfirm = () => {
    if (removalPending) {
      showWishlistToast(removalPending, false);
      confirmRemove();
    }
  };

  return (
    <AlertDialog open={!!removalPending} onOpenChange={(open) => !open && cancelRemove()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Remover dos Favoritos</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover <strong>{removalPending?.title}</strong> dos seus favoritos?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelRemove}>{t('common.back') || 'Cancelar'}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {t('common.remove') || 'Remover'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
