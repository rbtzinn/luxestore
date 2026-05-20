import { Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';

function renderToastIcon(children: React.ReactNode) {
  return <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">{children}</span>;
}

export function showAddedToCartToast(product: Product, quantity = 1) {
  toast.success('Adicionado ao carrinho com sucesso!', {
    description: `${quantity}x ${product.title}`,
    icon: renderToastIcon(
        <ShoppingBag className="h-4 w-4" />
    ),
  });
}

export function showWishlistToast(product: Product, isFavorite: boolean) {
  toast.success(isFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos', {
    description: product.title,
    icon: renderToastIcon(
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
    ),
  });
}
