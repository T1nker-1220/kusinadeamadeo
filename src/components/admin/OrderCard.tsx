'use client';

import React from 'react';
import { useAdminStore, Order } from '@/stores/adminStore';
import { createClient } from '@/utils/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BadgeCheck, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const supabase = createClient();

type Props = {
  order: Order;
};

const statusMeta: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  'Pending Confirmation': {
    color: 'bg-yellow-400 text-black',
    icon: <Clock size={16} className="inline-block mr-1" />, label: 'Pending Confirmation'
  },
  'Accepted': {
    color: 'bg-blue-500 text-white',
    icon: <BadgeCheck size={16} className="inline-block mr-1" />, label: 'Accepted'
  },
  'Preparing': {
    color: 'bg-[var(--color-warning)] text-black',
    icon: <Loader2 size={16} className="inline-block mr-1 animate-spin" />, label: 'Preparing'
  },
  'Ready': {
    color: 'bg-[var(--color-success)] text-white',
    icon: <BadgeCheck size={16} className="inline-block mr-1" />, label: 'Ready'
  },
  'Completed': {
    color: 'bg-gray-300 text-gray-800',
    icon: <CheckCircle size={16} className="inline-block mr-1" />, label: 'Completed'
  },
  'Declined': {
    color: 'bg-[var(--color-danger)] text-white',
    icon: <XCircle size={16} className="inline-block mr-1" />, label: 'Declined'
  },
};

export default function OrderCard({ order }: Props) {
  const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);

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
      console.error('Failed to update status:', error);
    }
  };

  const handleAccept = async () => {
    handleStatusUpdate('Preparing');
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
  const groupedItems = order.order_items.reduce((acc, item) => {
    const tag = item.group_tag || 'Unassigned';
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(item);
    return acc;
  }, {} as Record<string, typeof order.order_items>);

  const meta = statusMeta[order.status] || { color: '', icon: null, label: order.status };

  return (
    <Card className="mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-foreground)]">{order.customer_name}</h2>
          <p className="text-[var(--color-muted)]">{order.customer_phone}</p>
          <p className="text-sm text-[var(--color-muted)]">Order placed at: {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center ${meta.color}`}>
            {meta.icon} {meta.label}
          </span>
          <p className="text-2xl font-bold text-[var(--color-success)]">₱{order.total_price}</p>
        </div>
      </div>
      <div className="border-t my-4 border-[var(--color-border)]"></div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2 text-[var(--color-foreground)]">Items Ordered:</h3>
          {Object.entries(groupedItems).map(([tag, items]) => (
            <div key={tag} className="mb-2">
              <p className="font-bold text-sm underline">{tag}</p>
              <ul className="space-y-1 text-sm list-disc list-inside">
                {items.map(item => (
                  <li key={item.id}>
                    <span className="font-medium">{item.quantity}x {item.product_name}</span>
                    {item.selected_options && Object.entries(item.selected_options).map(([key, value]) => (
                      <span key={key} className="text-[var(--color-muted)] ml-2">({value})</span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          {order.payment_proof_url && (
            <a
              href={order.payment_proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center mb-4"
            >
              <Button variant="accent" fullWidth>View Payment Proof</Button>
            </a>
          )}
          {order.status === 'Pending Confirmation' && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button onClick={handleDecline} variant="danger">Decline</Button>
              <Button onClick={handleAccept} variant="success">Accept</Button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 text-sm mt-4">
            <Button onClick={() => handleStatusUpdate('Preparing')} disabled={order.status !== 'Accepted'} variant="warning">Start Preparing</Button>
            <Button onClick={() => handleStatusUpdate('Ready')} disabled={order.status !== 'Preparing'} variant="success">Mark as Ready</Button>
            <Button onClick={() => handleStatusUpdate('Completed')} disabled={order.status !== 'Ready'} variant="secondary" className="col-span-2">Mark as Completed</Button>
          </div>
        </div>
      </div>
      {order.status === 'Declined' && order.decline_reason && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="font-semibold text-red-700">Decline Reason:</p>
          <p className="text-red-700">{order.decline_reason}</p>
        </div>
      )}
    </Card>
  );
} 