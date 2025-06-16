'use client';

import { useEffect, useState } from 'react';
import { useAdminStore, Order } from '@/stores/adminStore';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import OrderCard from '@/components/admin/OrderCard';
import AdminGuard from '@/components/admin/AdminGuard';
import { Loader2, Power, Clock, Save, XCircle } from 'lucide-react';

const supabase = createClient();

function KanbanColumn({ title, orders, emptyText }: { title: string; orders: Order[]; emptyText: string }) {
  return (
    <div className="flex-1 min-w-[85vw] sm:min-w-[280px] bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-slate-700 flex flex-col">
      <h2 className="text-sm font-bold mb-2 text-white tracking-tight">{title} <span className="font-normal text-slate-300 text-xs">({orders.length})</span></h2>
      <div className="space-y-1 flex-1 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 py-4 text-slate-400">
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
  const [isStoreOpen, setIsStoreOpen] = useState<boolean | null>(null);
  const [waitTime, setWaitTime] = useState('');
  const [isSavingWaitTime, setIsSavingWaitTime] = useState(false);

  const pendingOrders = orders.filter(o => o.status === "Pending Confirmation");
  const acceptedOrders = orders.filter(o => o.status === "Accepted");
  const preparingOrders = orders.filter(o => o.status === "Preparing");
  const readyOrders = orders.filter(o => o.status === "Ready");

  useEffect(() => {
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

      const { data: settingsData } = await supabase.from('store_settings').select('is_open, estimated_wait_time').eq('id', 1).single();
      if (settingsData) {
        setIsStoreOpen(settingsData.is_open);
        setWaitTime(settingsData.estimated_wait_time || '');
      }
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
  }, [setOrders, addOrder, updateOrderStatus]);

  const handleToggleStoreStatus = async () => {
    if (isStoreOpen === null) return;
    const newStatus = !isStoreOpen;
    setIsStoreOpen(newStatus);
    await supabase.from('store_settings').update({ is_open: newStatus }).eq('id', 1);
  };

  const handleSaveWaitTime = async () => {
    setIsSavingWaitTime(true);
    const { error } = await supabase
      .from('store_settings')
      .update({ estimated_wait_time: waitTime })
      .eq('id', 1);
      
    if (error) {
      alert("Failed to save wait time.");
    }
    setIsSavingWaitTime(false);
  };

  const handleResetWaitTime = async () => {
    const confirmed = window.confirm("Are you sure you want to reset the estimated wait time? This will hide the wait time from customers.");
    if (!confirmed) return;

    setIsSavingWaitTime(true);
    const { error } = await supabase
      .from('store_settings')
      .update({ estimated_wait_time: null })
      .eq('id', 1);
      
    if (error) {
      alert("Failed to reset wait time.");
    } else {
      setWaitTime('');
    }
    setIsSavingWaitTime(false);
  };



  return (
    <AdminGuard>
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="sticky top-0 z-20 p-4 border-b border-slate-700 bg-slate-800/90 backdrop-blur-sm shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <div className="flex items-center gap-1">
              <label htmlFor="wait-time" className="font-semibold text-sm flex items-center gap-1 text-white">
                <Clock size={14}/> Wait Time:
              </label>
              <input
                id="wait-time"
                type="text"
                value={waitTime}
                onChange={(e) => setWaitTime(e.target.value)}
                className="p-1 border border-slate-600 rounded-md bg-slate-700 text-white w-24 text-sm placeholder-slate-400"
                placeholder="e.g., 15-20 min"
              />
              <button 
                onClick={handleSaveWaitTime} 
                disabled={isSavingWaitTime}
                className="bg-orange-500 text-white p-1 rounded hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center h-7 w-7 transition-colors"
                title="Save wait time"
              >
                {isSavingWaitTime ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              </button>
              {waitTime && (
                <button 
                  onClick={handleResetWaitTime} 
                  disabled={isSavingWaitTime}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600 disabled:opacity-50 flex items-center justify-center h-7 w-7 transition-colors"
                  title="Reset wait time"
                >
                  <XCircle size={12} />
                </button>
              )}
            </div>
            <button
              onClick={handleToggleStoreStatus}
              className={`flex items-center gap-1 px-3 py-1 rounded font-semibold transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                isStoreOpen ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <Power size={14} />
              {isStoreOpen === null ? "Loading..." : isStoreOpen ? "Close Store" : "Open Store"}
            </button>
            <Link href="/admin/report" className="bg-blue-500 text-white font-bold py-1 px-3 rounded hover:bg-blue-600 text-sm transition-colors">
              Reports
            </Link>
          </div>
        </header>

        <main className="flex-grow flex flex-col sm:flex-row gap-4 p-4 overflow-x-auto">
          <KanbanColumn title="Pending Confirmation" orders={pendingOrders} emptyText="No pending orders yet!" />
          <KanbanColumn title="Accepted" orders={acceptedOrders} emptyText="No accepted orders." />
          <KanbanColumn title="Preparing" orders={preparingOrders} emptyText="No orders being prepared." />
          <KanbanColumn title="Ready for Pickup" orders={readyOrders} emptyText="No orders ready for pickup." />
        </main>
      </div>
    </AdminGuard>
  );
} 