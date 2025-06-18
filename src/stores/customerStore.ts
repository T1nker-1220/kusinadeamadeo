import { create } from 'zustand';

type ProductInfo = {
  id: number;
  name: string;
  base_price: number;
  image_url: string | null;
  is_available?: boolean;
  owner?: string;
};

export type SelectedOption = {
  group_name: string;
  name: string;
  additional_price: number;
  is_available?: boolean;
};

export type CartItem = {
  cartItemId: string;
  product: ProductInfo;
  quantity: number;
  selectedOptions: SelectedOption[];
  itemTotal: number;
  groupTag?: string;
};

type CustomerState = {
  cart: CartItem[];
  addToCart: (product: ProductInfo, options?: SelectedOption[]) => void;
  quickAddToCart: (product: ProductInfo, options?: SelectedOption[]) => string;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, action: 'increase' | 'decrease') => void;
  updateCartItemOptions: (cartItemId: string, newOptions: SelectedOption[]) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;
  getCartItemQuantity: (signature: string) => number;
  setGroupTag: (cartItemId: string, tag: string) => void;
  isKioskMode: boolean;
  setIsKioskMode: (isKiosk: boolean) => void;
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
  cart: [],
  isKioskMode: false,

  addToCart: (product, options = []) => {
    // Safety check: Don't add unavailable products or options
    if (product.is_available === false) {
      console.warn('Attempted to add unavailable product to cart:', product.name);
      return;
    }
    
    // Check if any selected options are unavailable
    const unavailableOptions = options.filter(opt => opt.is_available === false);
    if (unavailableOptions.length > 0) {
      console.warn('Attempted to add unavailable options to cart:', unavailableOptions);
      return;
    }

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

  quickAddToCart: (product, options = []) => {
    // Same as addToCart but returns the signature for UI feedback
    get().addToCart(product, options);
    return `${product.id}-${options.map(o => `${o.group_name}:${o.name}`).sort().join('-')}`;
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

  getCartItemQuantity: (signature) => {
    const cart = get().cart;
    const item = cart.find(item => item.cartItemId === signature);
    return item ? item.quantity : 0;
  },

  setGroupTag: (cartItemId, tag) => {
    set(state => ({
      cart: state.cart.map(item => 
        item.cartItemId === cartItemId ? { ...item, groupTag: tag } : item
      )
    }));
  },

  updateCartItemOptions: (cartItemId, newOptions) => {
    set(state => {
      const cart = state.cart;
      const itemToUpdate = cart.find(item => item.cartItemId === cartItemId);
      if (!itemToUpdate) return { cart }; // Item not found, do nothing

      // Generate the new signature based on the new options
      const newSignature = `${itemToUpdate.product.id}-${newOptions.map(o => `${o.group_name}:${o.name}`).sort().join('-')}`;
      
      // If the new signature is the same as the old one, no real change, so do nothing.
      if (newSignature === cartItemId) return { cart };

      // Check if an item with the new signature already exists in the cart
      const existingItemWithNewOptions = cart.find(item => item.cartItemId === newSignature);
      
      let newCart = [...cart];

      if (existingItemWithNewOptions) {
        // **MERGE LOGIC:** An item with these options already exists.
        // 1. Add the quantity of the item-being-edited to the existing one.
        existingItemWithNewOptions.quantity += itemToUpdate.quantity;
        // 2. Remove the original item-being-edited from the cart.
        newCart = newCart.filter(item => item.cartItemId !== cartItemId);
      } else {
        // **UPDATE LOGIC:** No existing item found, so we can safely update the current one.
        newCart = newCart.map(item => {
          if (item.cartItemId === cartItemId) {
            const optionsTotal = newOptions.reduce((sum, opt) => sum + opt.additional_price, 0);
            const newItemTotal = item.product.base_price + optionsTotal;
            return {
              ...item,
              cartItemId: newSignature, // Update its ID
              selectedOptions: newOptions,
              itemTotal: newItemTotal,
            };
          }
          return item;
        });
      }

      return { cart: newCart };
    });
  },

  setIsKioskMode: (isKiosk: boolean) => set({ isKioskMode: isKiosk }),
})); 