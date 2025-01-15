import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variantId?: string;
  variantName?: string;
  addons: Array<{
    id: string;
    name: string;
    price: number;
  }>;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: Math.random().toString(36).substring(2, 9),
            },
          ],
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalAmount: () => {
        return get().items.reduce((total, item) => {
          const itemTotal = item.price * item.quantity;
          const addonsTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
          return total + (itemTotal + addonsTotal * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
