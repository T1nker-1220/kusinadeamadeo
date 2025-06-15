import { CartItem } from '@/stores/customerStore';

const LAST_ORDER_KEY = 'kda-last-order';
const ORDER_HISTORY_KEY = 'kda-order-history';

// Order history types
export interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  placedAt: string;
  totalPrice: number;
  paymentMethod: 'PayAtStore' | 'GCash';
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  status: string;
}

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

/**
 * Saves an order to the order history.
 * @param orderData - The order data to save to history.
 */
export function saveOrderToHistory(orderData: OrderHistoryItem): void {
  try {
    const existingHistory = getOrderHistory();
    const updatedHistory = [orderData, ...existingHistory];
    window.localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Could not save order to history:", error);
  }
}

/**
 * Retrieves all orders from order history.
 * @returns Array of OrderHistoryItem objects.
 */
export function getOrderHistory(): OrderHistoryItem[] {
  try {
    const historyData = window.localStorage.getItem(ORDER_HISTORY_KEY);
    if (historyData) {
      return JSON.parse(historyData) as OrderHistoryItem[];
    }
    return [];
  } catch (error) {
    console.error("Could not retrieve order history:", error);
    return [];
  }
}

/**
 * Clears all order history from local storage.
 */
export function clearOrderHistory(): void {
  try {
    window.localStorage.removeItem(ORDER_HISTORY_KEY);
  } catch (error) {
    console.error("Could not clear order history:", error);
  }
} 