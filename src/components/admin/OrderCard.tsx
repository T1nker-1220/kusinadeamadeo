'use client';

import { useAdminStore, Order } from '@/stores/adminStore';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

type Props = {
  order: Order;
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
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
  
  const statusColors: Record<Order['status'], string> = {
    New: 'bg-blue-100 text-blue-800',
    Preparing: 'bg-yellow-100 text-yellow-800',
    Ready: 'bg-green-100 text-green-800',
    Completed: 'bg-gray-200 text-gray-800',
    Cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white border rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{order.customer_name}</h2>
          <p className="text-gray-600">{order.customer_phone}</p>
          <p className="text-sm text-gray-500">Order placed at: {formatTime(order.created_at)}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[order.status]}`}>
            {order.status}
          </span>
          <p className="text-2xl font-bold mt-2">₱{order.total_price}</p>
        </div>
      </div>

      <div className="border-t my-4"></div>

      {/* Order Items */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Items Ordered:</h3>
          <ul className="space-y-1 text-sm">
            {order.order_items.map(item => (
              <li key={item.id}>
                <span className="font-medium">{item.quantity}x {item.product_name}</span>
                {item.selected_options && Object.entries(item.selected_options).map(([key, value]) => (
                  <span key={key} className="text-gray-500 ml-2">({value})</span>
                ))}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Proof and Actions */}
        <div>
          <a
            href={order.payment_proof_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 mb-4"
          >
            View Payment Proof
          </a>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button onClick={() => handleStatusUpdate('Preparing')} disabled={order.status !== 'New'} className="bg-yellow-500 text-black font-semibold py-2 rounded-md disabled:bg-gray-300">Start Preparing</button>
            <button onClick={() => handleStatusUpdate('Ready')} disabled={order.status !== 'Preparing'} className="bg-green-500 text-white font-semibold py-2 rounded-md disabled:bg-gray-300">Mark as Ready</button>
            <button onClick={() => handleStatusUpdate('Completed')} disabled={order.status !== 'Ready'} className="col-span-2 bg-gray-600 text-white font-semibold py-2 rounded-md disabled:bg-gray-300">Mark as Completed</button>
          </div>
        </div>
      </div>
    </div>
  );
} 