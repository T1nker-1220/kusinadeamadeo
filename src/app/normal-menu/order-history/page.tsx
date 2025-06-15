"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getOrderHistory, clearOrderHistory, OrderHistoryItem } from "@/utils/localStorage";
import { showSuccess, showError } from "@/utils/toast";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Clock, Package, User, Phone, CreditCard, Trash2 } from "lucide-react";

const supabase = createClient();

type OrderStatus =
  | "Pending Confirmation"
  | "Accepted"
  | "Declined"
  | "Preparing"
  | "Ready"
  | "Completed";

const statusMeta: Record<OrderStatus, { label: string; color: string }> = {
  "Pending Confirmation": { label: "Pending", color: "bg-yellow-400 text-black" },
  "Accepted": { label: "Accepted", color: "bg-blue-500 text-white" },
  "Preparing": { label: "Preparing", color: "bg-orange-500 text-white" },
  "Ready": { label: "Ready", color: "bg-green-600 text-white" },
  "Completed": { label: "Completed", color: "bg-gray-400 text-gray-800" },
  "Declined": { label: "Declined", color: "bg-red-600 text-white" },
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load order history from localStorage
    const history = getOrderHistory();
    setOrders(history);
    
    // Fetch current status for each order
    const fetchOrderStatuses = async () => {
      if (history.length === 0) {
        setIsLoading(false);
        return;
      }

      const orderIds = history.map(order => order.id);
      const { data: orderData } = await supabase
        .from("orders")
        .select("id, status")
        .in("id", orderIds);

      if (orderData) {
        const statusMap: Record<string, OrderStatus> = {};
        orderData.forEach(order => {
          statusMap[order.id.toString()] = order.status as OrderStatus;
        });
        setOrderStatuses(statusMap);
      }
      setIsLoading(false);
    };

    fetchOrderStatuses();

    // Set up real-time subscriptions for order status updates
    if (history.length > 0) {
      const channel = supabase
        .channel('order-history-status')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=in.(${history.map(order => order.id).join(',')})`,
          },
          (payload) => {
            setOrderStatuses(prev => ({
              ...prev,
              [payload.new.id.toString()]: payload.new.status as OrderStatus,
            }));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all order history? This action cannot be undone.")) {
      clearOrderHistory();
      setOrders([]);
      setOrderStatuses({});
      showSuccess("Order history cleared successfully.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center text-white">Loading order history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Order History</h1>
          <div className="flex gap-3">
            {orders.length > 0 && (
              <Button variant="danger" onClick={handleClearHistory} className="text-sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            )}
            <Link href="/normal-menu">
              <Button variant="secondary" className="text-sm">
                Back to Menu
              </Button>
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Order History</h2>
            <p className="text-slate-400 mb-6">You haven't placed any orders yet.</p>
            <Link href="/normal-menu">
              <Button variant="primary">Start Your First Order</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const currentStatus = orderStatuses[order.id] || order.status as OrderStatus;
              const statusInfo = statusMeta[currentStatus] || statusMeta["Pending Confirmation"];
              
              return (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          Order #{order.orderNumber.slice(-4)}
                        </h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(order.placedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{order.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>{order.paymentMethod === 'PayAtStore' ? 'Pay at Store' : 'GCash'}</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-sm">
                            <div>
                              <span className="text-white">
                                {item.quantity}x {item.product.name}
                              </span>
                              {item.groupTag && (
                                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  For: {item.groupTag}
                                </span>
                              )}
                              {item.selectedOptions.length > 0 && (
                                <div className="text-xs text-slate-400 mt-1 ml-4">
                                  {item.selectedOptions.map((opt, optIdx) => (
                                    <span key={optIdx} className="mr-2">
                                      {opt.group_name}: {opt.name}
                                      {opt.additional_price > 0 && ` (+₱${opt.additional_price})`}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <span className="text-green-400 font-medium">
                              ₱{item.itemTotal * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-600">
                        <span className="font-semibold text-white">Total: ₱{order.totalPrice}</span>
                        <Link href={`/normal-menu/order-status/${order.id}`}>
                          <Button variant="primary" className="text-sm">
                            View Status
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 