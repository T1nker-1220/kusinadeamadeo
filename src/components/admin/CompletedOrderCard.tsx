'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, Printer } from 'lucide-react';

type OrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  item_price: number;
  selected_options: Record<string, string> | null;
  group_tag: string | null;
};

type CompletedOrder = {
  id: number;
  customer_name: string;
  total_price: number;
  payment_proof_url: string | null;
  created_at: string;
  order_items: OrderItem[];
};

type Props = {
  order: CompletedOrder;
};

export default function CompletedOrderCard({ order }: Props) {
  const handlePrint = () => {
    // Open the dedicated print page in a new tab
    window.open(`/admin/print/${order.id}`, '_blank');
  };

  // Group items by their tag for display
  const orderItems = order.order_items || [];
  
  const groupedItems = orderItems.reduce((acc, item) => {
    const tag = item.group_tag || 'Unassigned';
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(item);
    return acc;
  }, {} as Record<string, typeof orderItems>);

  const orderNumber = order.id.toString().slice(-4); // Last 4 digits

  return (
    <Card className="mb-2 bg-slate-700/50 border-slate-600">
      {/* Order Number Header - Compact Display */}
      <div className="flex justify-between items-center mb-2 p-2 bg-green-500/20 border border-green-500/30 rounded">
        <div className="flex items-center gap-2">
          <div className="text-center">
            <p className="text-xs font-medium text-green-200">Order #</p>
            <p className="text-lg font-bold text-green-100">#{orderNumber}</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all"
            aria-label="Print Order"
          >
            <Printer size={12} />
            Print
          </button>
        </div>
        <span className="px-2 py-1 text-xs font-semibold rounded-full flex items-center bg-gray-300 text-gray-800">
          <CheckCircle size={12} className="inline-block mr-1" /> Completed
        </span>
      </div>

      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-sm font-bold text-white">{order.customer_name}</h2>
          <p className="text-xs text-slate-300">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        </div>
        <p className="text-lg font-bold text-green-400">₱{order.total_price}</p>
      </div>

      <div className="border-t my-2 border-slate-600"></div>

      <div className="grid grid-cols-1 gap-2">
        <div>
          <h3 className="text-xs font-semibold mb-1 text-white">Items:</h3>
          {orderItems.length === 0 ? (
            <p className="text-slate-400 text-xs">No items found</p>
          ) : (
            Object.entries(groupedItems).map(([tag, items]) => (
              <div key={tag} className="mb-1">
                <p className="font-bold text-xs text-blue-400">{tag}</p>
                <ul className="space-y-0 text-xs">
                  {items.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        <span className="font-medium text-slate-200">{item.quantity}x {item.product_name}</span>
                        {item.selected_options && Object.entries(item.selected_options).length > 0 && (
                          <span className="text-slate-400 ml-1">
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

        {/* Only show payment proof if available */}
        {order.payment_proof_url && (
          <div className="space-y-1">
            <a
              href={order.payment_proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="accent" fullWidth className="h-6 text-xs px-2 py-1">Payment Proof</Button>
            </a>
          </div>
        )}
      </div>
    </Card>
  );
} 