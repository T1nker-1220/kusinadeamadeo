'use client';

import { useEffect, useState } from 'react';
import { useAdminStore, Order } from '@/stores/adminStore';
import { createClient } from '@/utils/supabase/client';
import OrderCard from '@/components/admin/OrderCard';

const supabase = createClient();

export default function AdminPage() {
  const { orders, setOrders, addOrder, updateOrderStatus } = useAdminStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simple password protection
    if (!isAuthenticated) {
      const password = prompt('Enter admin password:');
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        alert('Incorrect password.');
        window.location.href = '/';
      }
      return;
    }

    // Fetch initial orders
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      
      if (data) {
        setOrders(data);
      }
    };

    fetchOrders();

    // Set up real-time subscription for all order changes
    const channel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: newOrderWithItems } = await supabase
              .from('orders').select('*, order_items(*)').eq('id', payload.new.id).single();
            if (newOrderWithItems) addOrder(newOrderWithItems);
          }
          if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as Order;
            updateOrderStatus(updatedOrder.id, updatedOrder.status);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, setOrders, addOrder, updateOrderStatus]);

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen"><p>Authenticating...</p></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-neutral-500">New orders will appear here in real-time.</p>
      </header>
      <main className="space-y-6">
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <p>No orders yet. Waiting for new orders...</p>
        )}
      </main>
    </div>
  );
} 