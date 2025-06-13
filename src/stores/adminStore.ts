import { create } from 'zustand';

// Define the shape of an order item
type OrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  item_price: number;
  selected_options: Record<string, string> | null;
  group_tag: string | null;
};

// Define the main Order type
export type Order = {
  id: number;
  customer_name: string;
  customer_phone: string;
  order_items: OrderItem[];
  total_price: number;
  payment_proof_url: string | null;
  payment_method: string;
  decline_reason: string | null;
  status: 'Pending Confirmation' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed' | 'Declined';
  created_at: string;
};

type AdminState = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: number, status: Order['status']) => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set(state => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (orderId, status) => {
    set(state => ({
      orders: state.orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    }))
  }
})); 