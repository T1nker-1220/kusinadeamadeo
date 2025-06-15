'use client';

import { useEffect, useState } from 'react';
import { useAdminStore, Order } from '@/stores/adminStore';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import OrderCard from '@/components/admin/OrderCard';
import { Loader2, Power } from 'lucide-react';

const supabase = createClient();

function KanbanColumn({ title, orders, emptyText }: { title: string; orders: Order[]; emptyText: string }) {
  return (
    <div className="flex-1 min-w-[85vw] sm:min-w-[280px] bg-surface rounded-lg p-2 shadow-md border border-border flex flex-col">
      <h2 className="text-sm font-bold mb-2 text-primary tracking-tight">{title} <span className="font-normal text-muted text-xs">({orders.length})</span></h2>
      <div className="space-y-1 flex-1 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 py-4 text-muted">
            <span className="text-2xl mb-1">🍽️</span>
            <span className="font-medium text-xs text-center">{emptyText}</span>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { orders, setOrders, addOrder, updateOrderStatus } = useAdminStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean | null>(null);

  const pendingOrders = orders.filter(o => o.status === "Pending Confirmation");
  const acceptedOrders = orders.filter(o => o.status === "Accepted");
  const preparingOrders = orders.filter(o => o.status === "Preparing");
  const readyOrders = orders.filter(o => o.status === "Ready");

  useEffect(() => {
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

    const fetchInitialData = async () => {
      try {
        // Fetch orders first
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        if (!orders) return;
        
        // Fetch all order items
        const { data: allOrderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*');
        
        if (itemsError) throw itemsError;
        
        console.log('🔍 All order items from DB:', allOrderItems);
        console.log('🔍 Sample order ID:', orders[0]?.id);
        console.log('🔍 Sample order items for first order:', allOrderItems?.filter(item => item.order_id === orders[0]?.id));
        
        // Manually join the data
        const ordersWithItems = orders.map(order => ({
          ...order,
          order_items: allOrderItems?.filter(item => String(item.order_id) === String(order.id)) || []
        }));
        
        setOrders(ordersWithItems);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }

      const { data: settingsData } = await supabase.from('store_settings').select('is_open').eq('id', 1).single();
      if (settingsData) setIsStoreOpen(settingsData.is_open);
    };

    fetchInitialData();

    const orderChannel = supabase.channel("realtime-orders").on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      async (payload) => {
        // Fetch the new order
        const { data: newOrder } = await supabase
          .from('orders')
          .select('*')
          .eq('id', payload.new.id)
          .single();
        
        if (newOrder) {
          // Fetch its items separately
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', newOrder.id);
          
          // Manually join
          const newOrderWithItems = {
            ...newOrder,
            order_items: orderItems || []
          };
          
          addOrder(newOrderWithItems);
        }
      }
    ).on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders' },
      (payload) => updateOrderStatus(payload.new.id, payload.new.status)
    ).subscribe();

    const settingsChannel = supabase.channel('realtime-settings').on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'store_settings', filter: 'id=eq.1' },
      (payload) => setIsStoreOpen(payload.new.is_open)
    ).subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, [isAuthenticated, setOrders, addOrder, updateOrderStatus]);

  const handleToggleStoreStatus = async () => {
    if (isStoreOpen === null) return;
    const newStatus = !isStoreOpen;
    setIsStoreOpen(newStatus);
    await supabase.from('store_settings').update({ is_open: newStatus }).eq('id', 1);
  };

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /> Authenticating...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background-gradient-to bg-gradient-to-b from-background-gradient-from to-background-gradient-to">
      <header className="sticky top-0 z-20 p-2 border-b bg-surface shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-lg font-bold text-primary tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleToggleStoreStatus}
            className={`flex items-center gap-1 px-3 py-1 rounded font-semibold transition-colors text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-accent ${
              isStoreOpen ? "bg-danger text-white hover:bg-danger/80" : "bg-success text-white hover:bg-success/80"
            }`}
          >
            <Power size={14} />
            {isStoreOpen === null ? "Loading..." : isStoreOpen ? "Close Store" : "Open Store"}
          </button>
          <Link href="/admin/report" className="bg-info text-white font-bold py-1 px-3 rounded hover:bg-info/80 text-sm">
            Reports
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col sm:flex-row gap-2 p-2 overflow-x-auto">
        <KanbanColumn title="Pending Confirmation" orders={pendingOrders} emptyText="No pending orders yet!" />
        <KanbanColumn title="Accepted" orders={acceptedOrders} emptyText="No accepted orders." />
        <KanbanColumn title="Preparing" orders={preparingOrders} emptyText="No orders being prepared." />
        <KanbanColumn title="Ready for Pickup" orders={readyOrders} emptyText="No orders ready for pickup." />
      </main>
    </div>
  );
} 