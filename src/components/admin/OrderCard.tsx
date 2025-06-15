'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore, Order } from '@/stores/adminStore';
import { createClient } from '@/utils/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BadgeCheck, Clock, CheckCircle, XCircle, Loader2, Phone, PhoneCall } from 'lucide-react';

const supabase = createClient();

type Props = {
  order: Order;
};

const statusMeta: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  'Pending Confirmation': {
    color: 'bg-yellow-400 text-black',
    icon: <Clock size={12} className="inline-block mr-1" />, label: 'Pending'
  },
  'Accepted': {
    color: 'bg-blue-500 text-white',
    icon: <BadgeCheck size={12} className="inline-block mr-1" />, label: 'Accepted'
  },
  'Preparing': {
    color: 'bg-[var(--color-warning)] text-black',
    icon: <Loader2 size={12} className="inline-block mr-1 animate-spin" />, label: 'Preparing'
  },
  'Ready': {
    color: 'bg-[var(--color-success)] text-white',
    icon: <BadgeCheck size={12} className="inline-block mr-1" />, label: 'Ready'
  },
  'Completed': {
    color: 'bg-gray-300 text-gray-800',
    icon: <CheckCircle size={12} className="inline-block mr-1" />, label: 'Done'
  },
  'Declined': {
    color: 'bg-[var(--color-danger)] text-white',
    icon: <XCircle size={12} className="inline-block mr-1" />, label: 'Declined'
  },
};

// Utility functions for localStorage
const getCalledOrders = (): Set<string> => {
  try {
    const calledOrders = localStorage.getItem('admin-called-orders');
    return new Set(calledOrders ? JSON.parse(calledOrders) : []);
  } catch {
    return new Set();
  }
};

const setCalledOrder = (orderId: string, called: boolean) => {
  try {
    const calledOrders = getCalledOrders();
    if (called) {
      calledOrders.add(orderId);
    } else {
      calledOrders.delete(orderId);
    }
    localStorage.setItem('admin-called-orders', JSON.stringify([...calledOrders]));
  } catch (error) {
    console.error('Failed to update called orders:', error);
  }
};

export default function OrderCard({ order }: Props) {
  const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);
  const [isCalled, setIsCalled] = useState(false);

  // Load called status from localStorage
  useEffect(() => {
    const calledOrders = getCalledOrders();
    setIsCalled(calledOrders.has(order.id.toString()));
  }, [order.id]);

  const handleToggleCalled = () => {
    const newCalledState = !isCalled;
    setIsCalled(newCalledState);
    setCalledOrder(order.id.toString(), newCalledState);
  };

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id)
      .select()
      .single();

    if (data) {
      updateOrderStatus(order.id, newStatus);
    } else {
      console.error('❌ Failed to update status:', error);
    }
  };

  const handleAccept = async () => {
    handleStatusUpdate('Accepted');
  };

  const handleDecline = async () => {
    const reason = prompt('Please provide a reason for declining this order:');
    if (reason && reason.trim() !== '') {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'Declined', decline_reason: reason })
        .eq('id', order.id);
      if (error) console.error('Failed to decline:', error);
    } else {
      alert('A reason is required to decline an order.');
    }
  };

  // Group items by their tag for display
  // Ensure order_items exists and is an array
  const orderItems = order.order_items || [];
  
  const groupedItems = orderItems.reduce((acc, item) => {
    const tag = item.group_tag || 'Unassigned';
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(item);
    return acc;
  }, {} as Record<string, typeof orderItems>);

  const meta = statusMeta[order.status] || { color: '', icon: null, label: order.status };
  const orderNumber = order.id.toString().slice(-4); // Last 4 digits

  return (
    <Card className="mb-2">
      {/* Order Number Header - Compact Display */}
      <div className="flex justify-between items-center mb-2 p-2 bg-orange-100 border border-orange-300 rounded">
        <div className="flex items-center gap-2">
          <div className="text-center">
            <p className="text-xs font-medium text-orange-800">Order #</p>
            <p className="text-lg font-bold text-orange-900">#{orderNumber}</p>
          </div>
          <button
            onClick={handleToggleCalled}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              isCalled 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isCalled ? <PhoneCall size={12} /> : <Phone size={12} />}
            {isCalled ? 'Called' : 'Call'}
          </button>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center ${meta.color}`}>
          {meta.icon} {meta.label}
        </span>
      </div>

      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-sm font-bold text-[var(--color-foreground)]">{order.customer_name}</h2>
          <p className="text-xs text-[var(--color-muted)]">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        </div>
        <p className="text-lg font-bold text-[var(--color-success)]">₱{order.total_price}</p>
      </div>

      <div className="border-t my-2 border-[var(--color-border)]"></div>

      <div className="grid grid-cols-1 gap-2">
        <div>
          <h3 className="text-xs font-semibold mb-1 text-[var(--color-foreground)]">Items:</h3>
          {orderItems.length === 0 ? (
            <p className="text-[var(--color-muted)] text-xs">No items found</p>
          ) : (
            Object.entries(groupedItems).map(([tag, items]) => (
              <div key={tag} className="mb-1">
                <p className="font-bold text-xs text-blue-600">{tag}</p>
                <ul className="space-y-0 text-xs">
                  {items.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        <span className="font-medium">{item.quantity}x {item.product_name}</span>
                        {item.selected_options && Object.entries(item.selected_options).length > 0 && (
                          <span className="text-[var(--color-muted)] ml-1">
                            ({Object.values(item.selected_options).join(', ')})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="space-y-1">
          {order.payment_proof_url && (
            <a
              href={order.payment_proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="accent" fullWidth className="h-6 text-xs px-2 py-1">Payment Proof</Button>
            </a>
          )}
          
          {order.status === 'Pending Confirmation' && (
            <div className="grid grid-cols-2 gap-1">
              <Button onClick={handleDecline} variant="danger" className="h-6 text-xs px-2 py-1">Decline</Button>
              <Button onClick={handleAccept} variant="success" className="h-6 text-xs px-2 py-1">Accept</Button>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-1">
            <Button 
              onClick={() => handleStatusUpdate('Preparing')} 
              disabled={order.status !== 'Accepted'} 
              variant="warning"
              className="h-6 text-xs px-1 py-1"
            >
              Prepare
            </Button>
            <Button 
              onClick={() => handleStatusUpdate('Ready')} 
              disabled={order.status !== 'Preparing'} 
              variant="success"
              className="h-6 text-xs px-1 py-1"
            >
              Ready
            </Button>
          </div>
          
          <Button 
            onClick={() => handleStatusUpdate('Completed')} 
            disabled={order.status !== 'Ready'} 
            variant="secondary" 
            className="w-full h-6 text-xs px-2 py-1"
          >
            Complete
          </Button>
        </div>
      </div>

      {order.status === 'Declined' && order.decline_reason && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 rounded">
          <p className="font-semibold text-xs text-red-700">Declined:</p>
          <p className="text-xs text-red-700">{order.decline_reason}</p>
        </div>
      )}
    </Card>
  );
} 