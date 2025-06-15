'use client';

import { useState, useEffect } from 'react';
import { getLastOrder } from '@/utils/localStorage';
import { useCustomerStore, CartItem } from '@/stores/customerStore';
import Button from '@/components/ui/Button';
import { RotateCcw, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecentOrder() {
  const [lastOrder, setLastOrder] = useState<CartItem[] | null>(null);
  const addToCart = useCustomerStore((state) => state.addToCart);

  useEffect(() => {
    // Fetch the last order from local storage when the component mounts.
    const savedOrder = getLastOrder();
    if (savedOrder && savedOrder.length > 0) {
      setLastOrder(savedOrder);
    }
  }, []);

  const handleAddAllToCart = () => {
    if (!lastOrder) return;
    lastOrder.forEach(item => {
      // We need to re-add the item with its options
      addToCart(item.product, item.selectedOptions);
    });
    toast.success('Your last order has been added to the cart!');
  };

  const handleAddItemToCart = (item: CartItem) => {
    addToCart(item.product, item.selectedOptions);
    toast.success(`${item.product.name} added to cart!`);
  };

  if (!lastOrder) {
    return null; // Don't render anything if there's no saved order.
  }

  return (
    <div className="mb-3 p-2 mx-1 bg-surface border border-border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-primary flex items-center">
          <RotateCcw className="mr-1" size={16} />
          Quick Re-order
        </h2>
        <Button onClick={handleAddAllToCart} variant="secondary" className="text-xs px-2 py-1">
          Add All
        </Button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1">
        {lastOrder.map((item) => (
          <div key={item.cartItemId} className="bg-secondary p-2 rounded-md text-center">
            <p className="font-medium text-xs truncate">{item.product.name}</p>
            <p className="text-xs text-muted mb-1">x{item.quantity}</p>
            <Button onClick={() => handleAddItemToCart(item)} variant="chip" active={false} className="text-xs px-1 py-0.5">
              <Plus size={12} className="mr-0.5" /> Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 