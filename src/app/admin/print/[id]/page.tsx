"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";

// Types for the fetched data
type OrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  item_price: number;
  selected_options: Record<string, string> | null;
  group_tag: string | null;
};

type OrderData = {
  id: number;
  customer_name: string;
  created_at: string;
  payment_method: string;
  total_price: number;
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

  // Calculate subtotal (sum of all items)
  const subtotal = order.order_items.reduce((sum, item) => sum + (item.item_price * item.quantity), 0);
  const orderNumber = order.id.toString().padStart(4, '0');

  return (
    <div className="p-4 font-mono text-black bg-white w-[80mm] min-h-screen">
      {/* Business Header */}
      <header className="text-center mb-4 border-b-2 border-black border-double pb-3">
        <h1 className="text-lg font-bold mb-1">KUSINA DE AMADEO</h1>
        <p className="text-xs">Authentic Filipino Cuisine</p>
        <p className="text-xs">📍 107 i Purok 4 Dagatan, Amadeo, Cavite</p>
        <p className="text-xs">📞 (046) 890-9060 | 📱 +63 960 508 8715</p>
        <p className="text-xs">✉️ marquezjohnnathanieljade@gmail.com</p>
      </header>

      {/* Order Info */}
      <section className="text-xs mb-4 border-b border-black border-dashed pb-3">
        <div className="flex justify-between">
          <span>ORDER #:</span>
          <span className="font-bold">#{orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>CUSTOMER:</span>
          <span className="font-bold">{order.customer_name}</span>
        </div>
        <div className="flex justify-between">
          <span>DATE:</span>
          <span>{new Date(order.created_at).toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
          })}</span>
        </div>
        <div className="flex justify-between">
          <span>TIME:</span>
          <span>{new Date(order.created_at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          })}</span>
        </div>
        <div className="flex justify-between">
          <span>PAYMENT:</span>
          <span className="font-bold">{order.payment_method}</span>
        </div>
      </section>

      {/* Order Items */}
      <main className="mb-4">
        <div className="flex justify-between text-xs font-bold border-b border-black mb-2 pb-1">
          <span>ITEM</span>
          <span>QTY</span>
          <span>PRICE</span>
          <span>TOTAL</span>
        </div>

        {Object.entries(groupedItems).map(([tag, items]) => (
          <div key={tag} className="mb-3">
            {Object.keys(groupedItems).length > 1 && (
              <div className="text-xs font-bold bg-gray-100 px-1 py-1 mb-2 uppercase border-t border-b border-black">
                {tag}
              </div>
            )}
            {items.map(item => {
              const itemTotal = item.item_price * item.quantity;
              return (
                <div key={item.id} className="mb-2">
                  {/* Product line */}
                  <div className="flex justify-between text-xs">
                    <span className="flex-1 font-medium">{item.product_name}</span>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <span className="w-12 text-right">₱{item.item_price.toFixed(2)}</span>
                    <span className="w-12 text-right font-bold">₱{itemTotal.toFixed(2)}</span>
                  </div>
                  {/* Options/Add-ons */}
                  {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                    <div className="pl-2 text-xs text-gray-600">
                      {Object.entries(item.selected_options).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span>  + {value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </main>

      {/* Totals Section - Simplified without VAT */}
      <section className="border-t-2 border-black border-double pt-3 mb-4">
        <div className="flex justify-between text-sm font-bold">
          <span>TOTAL AMOUNT:</span>
          <span>₱{order.total_price.toFixed(2)}</span>
        </div>
        {order.payment_method === 'PayAtStore' && (
          <>
            <div className="flex justify-between text-xs mt-2">
              <span>AMOUNT PAID:</span>
              <span>₱{order.total_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>CHANGE:</span>
              <span>₱0.00</span>
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-black border-double pt-3 text-center text-xs">
        <p className="font-bold mb-2">*** THANK YOU FOR YOUR ORDER! ***</p>
        <p className="mb-1">Please keep this receipt for your reference.</p>
        <p className="mb-1">Operating Hours: 5:00 AM - 12:00 AM daily</p>
        <p className="mb-1">Order Hours: 8:00 AM - 10:00 PM</p>
        <p className="mb-2">Follow us: @KusinaDeAmadeo</p>
        <p className="text-xs">THIS SERVES AS YOUR OFFICIAL RECEIPT</p>
        <p className="text-xs mt-2">--- END OF RECEIPT ---</p>
      </footer>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none;
          }
          div {
            page-break-inside: avoid;
          }
        }
      `}</style>
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
      try {
        // First fetch the order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select("id, customer_name, created_at, payment_method, total_price")
          .eq("id", id)
          .single();

        if (orderError) {
          console.error('Order fetch error:', orderError);
          setError("Order not found or could not be loaded.");
          return;
        }

        // Then fetch the order items separately
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select("id, product_name, quantity, item_price, selected_options, group_tag")
          .eq("order_id", id);

        if (itemsError) {
          console.error('Order items fetch error:', itemsError);
          setError("Order items could not be loaded.");
          return;
        }

        // Manually join the data
        const orderWithItems = {
          ...order,
          order_items: orderItems || []
        };

        setOrder(orderWithItems as OrderData);
        // Remove auto-print to prevent React setState warnings
        // Users can manually print using Ctrl+P or browser print button
      } catch (error) {
        console.error('Fetch error:', error);
        setError("An error occurred while loading the order.");
      }
    };

    fetchOrder();
  }, [id]);

  if (error) {
    return (
      <AdminGuard>
        <div className="p-8 text-red-500">{error}</div>
      </AdminGuard>
    );
  }
  
  if (!order) {
    return (
      <AdminGuard>
        <div className="p-8 flex items-center gap-2"><Loader2 className="animate-spin" /> Loading order for printing...</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="no-print p-4 mb-4 bg-gray-100 text-center">
        <button 
          onClick={() => window.print()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
        >
          🖨️ Print Receipt
        </button>
        <span className="text-sm text-gray-600">or press Ctrl+P</span>
      </div>
      <PrintReceipt order={order} />
    </AdminGuard>
  );
} 