import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistState {
  items: Product[];
  removalPending: Product | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  confirmRemove: () => void;
  cancelRemove: () => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      removalPending: null,
      addItem: (product) => {
        set((state) => {
          if (state.items.find((i) => i.id === product.id)) return state;
          return { items: [...state.items, product] };
        });
      },
      removeItem: (productId) => {
        const itemToRemove = get().items.find((i) => i.id === productId);
        if (itemToRemove) {
          set({ removalPending: itemToRemove });
        }
      },
      confirmRemove: () => {
        const pending = get().removalPending;
        if (pending) {
          set((state) => ({ 
            items: state.items.filter((i) => i.id !== pending.id),
            removalPending: null 
          }));
        }
      },
      cancelRemove: () => set({ removalPending: null }),
      isInWishlist: (productId) => get().items.some((i) => i.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { 
      name: 'luxe-wishlist',
      partialize: (state) => ({ items: state.items }) // Don't persist removalPending
    }
  )
);
