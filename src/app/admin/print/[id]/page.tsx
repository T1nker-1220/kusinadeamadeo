"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

// Types for the fetched data
type OrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  selected_options: Record<string, string> | null;
  group_tag: string | null;
};

type OrderData = {
  id: number;
  customer_name: string;
  created_at: string;
  payment_method: string;
  order_items: OrderItem[];
};

const supabase = createClient();

// A simple component to render the receipt layout
function PrintReceipt({ order }: { order: OrderData }) {
  const groupedItems = order.order_items.reduce((acc, item) => {
    const tag = item.group_tag || 'Main Order';
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(item);
    return acc;
  }, {} as Record<string, OrderItem[]>);

  return (
    <div className="p-2 font-mono text-black bg-white w-[80mm]">
      <header className="text-center mb-4">
        <h1 className="text-xl font-bold">Kusina De Amadeo</h1>
        <p className="text-lg font-semibold">ORDER #{order.id.toString().slice(-4)}</p>
      </header>

      <section className="text-xs mb-4 border-b border-black border-dashed pb-2">
        <p>Customer: {order.customer_name}</p>
        <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
        <p>Time: {new Date(order.created_at).toLocaleTimeString()}</p>
        <p>Payment: {order.payment_method}</p>
      </section>

      <main>
        {Object.entries(groupedItems).map(([tag, items]) => (
          <div key={tag} className="mb-3">
            {Object.keys(groupedItems).length > 1 && (
              <h2 className="font-bold border-y border-black my-1 py-1 uppercase">{tag}</h2>
            )}
            {items.map(item => (
              <div key={item.id} className="mb-2">
                <p className="font-bold text-sm leading-tight">
                  {item.quantity}x {item.product_name}
                </p>
                {item.selected_options && (
                  <ul className="pl-4 text-xs">
                    {Object.entries(item.selected_options).map(([key, value]) => (
                      <li key={key}>- {value}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </main>

      <footer className="border-t border-black border-dashed pt-2 mt-4 text-center text-xs">
        <p>*** Thank You! ***</p>
      </footer>
    </div>
  );
}

// The main page component that triggers the print
export default function PrintPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, created_at, payment_method, order_items(*)")
        .eq("id", id)
        .single();

      if (error) {
        setError("Order not found or could not be loaded.");
      } else if (data) {
        setOrder(data as OrderData);
        // Use a timeout to ensure the DOM is fully rendered before printing
        setTimeout(() => window.print(), 500);
      }
    };

    fetchOrder();
  }, [id]);

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }
  
  if (!order) {
    return <div className="p-8 flex items-center gap-2"><Loader2 className="animate-spin" /> Loading order for printing...</div>;
  }

  return <PrintReceipt order={order} />;
} 