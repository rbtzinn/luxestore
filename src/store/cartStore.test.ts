import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: '1',
  title: 'Produto Teste',
  price: 100,
  sale_price: null,
  description: 'Test',
  category_id: 'cat1',
  brand: 'Brand',
  sku: '123',
  stock: 10,
  rating: 5,
  review_count: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  images: [],
  attributes: {}
};

describe('Cart Store Logic (Zustand)', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('deve adicionar um item ao carrinho', () => {
    useCartStore.getState().addItem(mockProduct);
    const { items, getTotal, getItemCount } = useCartStore.getState();
    
    expect(items).toHaveLength(1);
    expect(items[0].product_id).toBe('1');
    expect(items[0].quantity).toBe(1);
    expect(getTotal()).toBe(100);
    expect(getItemCount()).toBe(1);
  });

  it('deve incrementar a quantidade se adicionar o mesmo produto', () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().addItem(mockProduct, 2);
    
    const { items, getItemCount, getTotal } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(getItemCount()).toBe(3);
    expect(getTotal()).toBe(300);
  });

  it('deve usar o preço de promoção (sale_price) se disponível', () => {
    const saleProduct = { ...mockProduct, id: '2', price: 150, sale_price: 90 };
    useCartStore.getState().addItem(saleProduct);
    
    const { items, getTotal } = useCartStore.getState();
    expect(items[0].price).toBe(90);
    expect(getTotal()).toBe(90);
  });

  it('deve lidar com pedido de item duplicado (requestAddItem)', () => {
    useCartStore.getState().addItem(mockProduct);
    
    useCartStore.getState().requestAddItem(mockProduct);
    
    let state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(1);
    expect(state.duplicatePending).toBeTruthy();
    expect(state.duplicatePending?.product.id).toBe('1');

    state.confirmDuplicateAdd();
    state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(2);
    expect(state.duplicatePending).toBeNull();
  });

  it('deve remover um item do carrinho', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().removeItem('1');
    
    const { items, getTotal } = useCartStore.getState();
    expect(items).toHaveLength(0);
    expect(getTotal()).toBe(0);
  });

  it('deve atualizar a quantidade de um item corretamente', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().updateQuantity('1', 5);
    
    const { items, getTotal } = useCartStore.getState();
    expect(items[0].quantity).toBe(5);
    expect(getTotal()).toBe(500);
  });

  it('deve remover o item se a quantidade for atualizada para 0', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().updateQuantity('1', 0);
    
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
