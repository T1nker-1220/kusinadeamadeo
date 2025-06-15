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
    <div className="mb-8 p-4 bg-surface border border-border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary flex items-center">
          <RotateCcw className="mr-2" size={20} />
          Quick Re-order
        </h2>
        <Button onClick={handleAddAllToCart} variant="secondary">
          Add All to Cart
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {lastOrder.map((item) => (
          <div key={item.cartItemId} className="bg-secondary p-3 rounded-md text-center">
            <p className="font-semibold text-sm truncate">{item.product.name}</p>
            <p className="text-xs text-muted mb-2">x{item.quantity}</p>
            <Button onClick={() => handleAddItemToCart(item)} variant="chip" active={false}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 