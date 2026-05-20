import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';

export function showAddedToCartToast(product: Product, quantity = 1) {
  toast.success('Adicionado ao carrinho com sucesso!', {
    description: `${quantity}x ${product.title}`,
    icon: <ShoppingBag className="h-4 w-4" />,
  });
}
