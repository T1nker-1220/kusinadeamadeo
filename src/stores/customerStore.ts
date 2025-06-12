import { create } from 'zustand';

type ProductInfo = {
  id: number;
  name: string;
  base_price: number;
  image_url: string | null;
};

export type SelectedOption = {
  group_name: string;
  name: string;
  additional_price: number;
};

export type CartItem = {
  cartItemId: string;
  product: ProductInfo;
  quantity: number;
  selectedOptions: SelectedOption[];
  itemTotal: number;
};

type CustomerState = {
  cart: CartItem[];
  addToCart: (product: ProductInfo, options?: SelectedOption[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, action: 'increase' | 'decrease') => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
  cart: [],

  addToCart: (product, options = []) => {
    const cart = get().cart;
    const signature = `${product.id}-${options.map(o => `${o.group_name}:${o.name}`).sort().join('-')}`;
    
    const existingItem = cart.find(item => item.cartItemId === signature);

    if (existingItem) {
      get().updateQuantity(existingItem.cartItemId, 'increase');
    } else {
      const optionsTotal = options.reduce((sum, opt) => sum + opt.additional_price, 0);
      const itemTotal = product.base_price + optionsTotal;
      
      const newItem: CartItem = {
        cartItemId: signature,
        product,
        quantity: 1,
        selectedOptions: options,
        itemTotal,
      };
      set(state => ({ cart: [...state.cart, newItem] }));
    }
  },

  removeFromCart: (cartItemId) => {
    set(state => ({
      cart: state.cart.filter(item => item.cartItemId !== cartItemId)
    }));
  },

  updateQuantity: (cartItemId, action) => {
    set(state => ({
      cart: state.cart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[]
    }));
  },

  clearCart: () => set({ cart: [] }),
  
  cartCount: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },
  
  cartTotal: () => {
    return get().cart.reduce((total, item) => {
      return total + (item.itemTotal * item.quantity);
    }, 0);
  },
})); 