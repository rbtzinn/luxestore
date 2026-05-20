import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  duplicatePending: { product: Product; quantity: number } | null;
  addItem: (product: Product, quantity?: number) => void;
  requestAddItem: (product: Product, quantity?: number) => void;
  confirmDuplicateAdd: () => void;
  cancelDuplicateAdd: () => void;
  hasItem: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      duplicatePending: null,
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product_id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: crypto.randomUUID(),
                product_id: product.id,
                product,
                quantity,
                price: product.sale_price ?? product.price,
              },
            ],
          };
        });
      },
      requestAddItem: (product, quantity = 1) => {
        if (get().hasItem(product.id)) {
          set({ duplicatePending: { product, quantity } });
          return;
        }

        get().addItem(product, quantity);
      },
      confirmDuplicateAdd: () => {
        const pending = get().duplicatePending;

        if (!pending) return;

        get().addItem(pending.product, pending.quantity);
        set({ duplicatePending: null });
      },
      cancelDuplicateAdd: () => set({ duplicatePending: null }),
      hasItem: (productId) => get().items.some((item) => item.product_id === productId),
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'luxe-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
