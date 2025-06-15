import { CartItem } from '@/stores/customerStore';

const LAST_ORDER_KEY = 'kda-last-order';

/**
 * Saves the last completed order to local storage.
 * @param cart - The array of CartItem objects from the customer's cart.
 */
export function saveLastOrder(cart: CartItem[]): void {
  try {
    const orderData = JSON.stringify(cart);
    window.localStorage.setItem(LAST_ORDER_KEY, orderData);
  } catch (error) {
    console.error("Could not save last order to local storage:", error);
  }
}

/**
 * Retrieves the last saved order from local storage.
 * @returns The array of CartItem objects or null if none exists.
 */
export function getLastOrder(): CartItem[] | null {
  try {
    const orderData = window.localStorage.getItem(LAST_ORDER_KEY);
    if (orderData) {
      return JSON.parse(orderData) as CartItem[];
    }
    return null;
  } catch (error) {
    console.error("Could not retrieve last order from local storage:", error);
    return null;
  }
} 