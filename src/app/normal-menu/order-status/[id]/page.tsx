"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomerStore } from "@/stores/customerStore";
import { showError, showSuccess } from "@/utils/toast";
import Button from "@/components/ui/Button";

const supabase = createClient();

type OrderStatus =
  | "Pending Confirmation"
  | "Accepted"
  | "Declined"
  | "Preparing"
  | "Ready"
  | "Completed";

const statusMeta: Record<OrderStatus, { label: string; color: string; message: string }> = {
  "Pending Confirmation": {
    label: "Pending Confirmation",
    color: "bg-yellow-400 text-black",
    message: "We have received your order. Please wait while we confirm it. This page will update automatically.",
  },
  "Accepted": {
    label: "Accepted",
    color: "bg-blue-500 text-white",
    message: "Order accepted! Please wait while we prepare your food.",
  },
  "Preparing": {
    label: "Preparing",
    color: "bg-orange-500 text-white",
    message: "Your order is being prepared. Please wait a moment.",
  },
  "Ready": {
    label: "Ready for Pickup",
    color: "bg-green-600 text-white",
    message: "Your order is ready for pickup! Please proceed to the store.",
  },
  "Completed": {
    label: "Completed",
    color: "bg-gray-400 text-gray-800",
    message: "Order completed. Thank you for ordering!",
  },
  "Declined": {
    label: "Declined",
    color: "bg-red-600 text-white",
    message: "Unfortunately, we could not accept your order.",
  },
};

export default function OrderStatusPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const { addToCart, setGroupTag, clearCart } = useCustomerStore();
  const [status, setStatus] = useState<OrderStatus>("Pending Confirmation");
  const [declineReason, setDeclineReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch initial order status
    const getOrderStatus = async () => {
      const { data } = await supabase
        .from("orders")
        .select("status, decline_reason")
        .eq("id", id)
        .single();
      if (data) {
        setStatus(data.status as OrderStatus);
        setDeclineReason(data.decline_reason);
      }
    };
    getOrderStatus();

    // Listen for real-time updates to THIS specific order
    const channel = supabase
      .channel(`order-status-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setStatus(payload.new.status as OrderStatus);
          setDeclineReason(payload.new.decline_reason);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const repopulateCartFromOrder = async () => {
    setIsLoading(true);
    // 1. Fetch the declined order items along with the product data needed for reconstruction
    const { data: orderItems, error } = await supabase
      .from("order_items")
      .select("*, products(*, options(*))")
      .eq("order_id", id);
    if (error || !orderItems) {
      showError("Could not retrieve order details. Please start a new order.");
      setIsLoading(false);
      return;
    }
    // 2. Clear any existing items in the cart to avoid conflicts
    clearCart();
    // 3. Loop through each item and reconstruct it for the cart
    for (const item of orderItems) {
      if (!item.products) continue; // Skip if the product was deleted
      const fullProduct = item.products;
      // Reconstruct the `selectedOptions` array with all its data
      const reconstructedOptions = item.selected_options 
        ? Object.entries(item.selected_options).map(([group, name]) => {
            const originalOption = fullProduct.options.find(
              (opt: any) => opt.group_name === group && opt.name === name
            );
            return {
              group_name: group,
              name: name as string,
              additional_price: originalOption?.additional_price || 0,
            };
          })
        : [];
      // Add the item to the cart (the store handles quantity)
      for (let i = 0; i < item.quantity; i++) {
        addToCart(fullProduct, reconstructedOptions);
      }
      // Re-apply the group tag if it exists
      if (item.group_tag) {
        const signature = `${fullProduct.id}-${reconstructedOptions.map(o => `${o.group_name}:${o.name}`).sort().join('-')}`;
        setGroupTag(signature, item.group_tag);
      }
    }
    // 4. Notify the user and redirect
    showError(`Order was declined: ${declineReason}`);
    showSuccess("Your previous items have been added back to your cart.");
    router.push('/normal-menu/cart');
    setIsLoading(false);
  };

  const renderContent = () => {
    if (status === "Declined") {
      return (
        <>
          <span className={`px-3 py-1 text-lg font-semibold rounded-full ${statusMeta[status].color}`}>{statusMeta[status].label}</span>
          <h1 className="text-4xl font-bold text-red-600 mt-4">Order Declined</h1>
          <p className="mt-4 text-lg">{statusMeta[status].message}</p>
          <p className="font-semibold mt-2">
            Reason: <span className="font-normal">{declineReason || "No reason provided."}</span>
          </p>
          <Button 
            variant="warning" 
            onClick={repopulateCartFromOrder} 
            loading={isLoading}
            className="mt-6"
          >
            Modify and Resubmit Order
          </Button>
        </>
      );
    }
    if (status === "Pending Confirmation") {
      return (
        <>
          <span className={`px-3 py-1 text-lg font-semibold rounded-full ${statusMeta[status].color}`}>{statusMeta[status].label}</span>
          <h1 className="text-4xl font-bold text-yellow-600 mt-4">Waiting for Confirmation...</h1>
          <p className="mt-4 text-lg">{statusMeta[status].message}</p>
        </>
      );
    }
    // For Accepted, Preparing, Ready, Completed
    return (
      <>
        <span className={`px-3 py-1 text-lg font-semibold rounded-full ${statusMeta[status].color}`}>{statusMeta[status].label}</span>
        <h1 className="text-4xl font-bold text-green-600 mt-4">{statusMeta[status].label}</h1>
        <p className="mt-4 text-lg">{statusMeta[status].message}</p>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
      <div className="text-center max-w-xl mx-auto p-8 bg-slate-800 rounded-lg border border-slate-600 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Order Status</h2>
        <div className="text-white">
          {renderContent()}
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/normal-menu/order-history"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Order History
          </Link>
          <Link
            href="/normal-menu"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
