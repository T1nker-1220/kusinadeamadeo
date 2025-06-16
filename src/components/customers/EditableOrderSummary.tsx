'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useCustomerStore, CartItem } from '@/stores/customerStore';
import { Plus, Minus, X, Edit3 } from 'lucide-react';
import Image from 'next/image';
import EditOptionsModal from './EditOptionsModal';

// Simple debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function EditableOrderSummary() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    setGroupTag,
  } = useCustomerStore();

  const groupedCart = useMemo(() => {
    if (!cart) return {};
    const groups = cart.reduce((acc, item) => {
      const key = item.groupTag || 'Unassigned Items';
      if (!acc[key]) {
        acc[key] = {
          items: [],
          subTotal: 0,
        };
      }
      acc[key].items.push(item);
      acc[key].subTotal += item.itemTotal * item.quantity;
      return acc;
    }, {} as Record<string, { items: typeof cart; subTotal: number }>);
    return groups;
  }, [cart]);

  // Local state for groupTag inputs
  const [groupTagInputs, setGroupTagInputs] = useState<Record<string, string>>({});
  
  // State for edit options modal
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  
  // Close modal if the editing item is no longer in cart (after update)
  useEffect(() => {
    if (editingItem && !cart.find(item => item.cartItemId === editingItem.cartItemId)) {
      setEditingItem(null);
    }
  }, [cart, editingItem]);

  // Sync local state with cart on mount and when cart changes
  useEffect(() => {
    const newInputs: Record<string, string> = {};
    cart.forEach(item => {
      newInputs[item.cartItemId] =
        groupTagInputs[item.cartItemId] !== undefined
          ? groupTagInputs[item.cartItemId]
          : item.groupTag || '';
    });
    setGroupTagInputs(newInputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length]);

  // Debounced setGroupTag per item
  const debouncedSetGroupTagRefs = useRef<Record<string, (tag: string) => void>>({});
  cart.forEach(item => {
    if (!debouncedSetGroupTagRefs.current[item.cartItemId]) {
      debouncedSetGroupTagRefs.current[item.cartItemId] = debounce((tag: string) => {
        setGroupTag(item.cartItemId, tag);
      }, 400);
    }
  });

  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
      <h2 className="text-lg font-semibold mb-4 text-primary">Your Order</h2>
      
      {/* Scrollable items area with compact spacing */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {Object.entries(groupedCart).map(([groupName, groupData]) => (
          <div key={groupName} className="bg-slate-700/50 rounded-lg p-2 border border-slate-600">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-primary text-sm">{groupName}</h4>
              <span className="font-semibold text-green-400 text-sm">Sub-total: ₱{groupData.subTotal}</span>
            </div>
            <div className="space-y-2">
              {groupData.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-slate-700 rounded-lg p-2 border border-slate-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-2">
                      <Image
                        src={item.product.image_url || "/images/products/logo.png"}
                        alt={item.product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover h-10 w-10"
                      />
                                             <div>
                         <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-medium text-white text-sm">{item.product.name}</h4>
                           {item.selectedOptions.length > 0 && (
                             <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                               Customized
                             </span>
                           )}
                         </div>
                         {item.selectedOptions.length > 0 && (
                           <ul className="text-xs text-slate-400">
                             {item.selectedOptions.map((opt, idx) => (
                               <li key={idx}>
                                 {opt.group_name}: {opt.name}
                                 {opt.additional_price > 0 && ` (+₱${opt.additional_price})`}
                               </li>
                             ))}
                           </ul>
                         )}
                       </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-slate-400 hover:text-blue-400 p-1"
                        title={item.selectedOptions.length > 0 ? "Edit options" : "Add options"}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-slate-400 hover:text-red-400 p-1"
                        title="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, "decrease")}
                        className="w-6 h-6 flex items-center justify-center bg-slate-600 border border-slate-500 text-white hover:bg-orange-500 hover:border-orange-500 transition-colors rounded-md"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-medium w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, "increase")}
                        className="w-6 h-6 flex items-center justify-center bg-slate-600 border border-slate-500 text-white hover:bg-orange-500 hover:border-orange-500 transition-colors rounded-md"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-green-400 font-semibold text-sm">₱{item.itemTotal * item.quantity}</span>
                      <div className="mt-1">
                        <input
                          type="text"
                          placeholder="Name this item"
                          value={groupTagInputs[item.cartItemId] || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setGroupTagInputs(inputs => ({ ...inputs, [item.cartItemId]: value }));
                            debouncedSetGroupTagRefs.current[item.cartItemId](value);
                          }}
                          className="w-24 text-xs px-1 py-1 rounded bg-slate-800 border border-slate-600 text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Grand total */}
      <div className="border-t border-slate-600 pt-3 mt-3 flex justify-between font-bold text-lg">
        <span className="text-white">Grand Total</span>
        <span className="text-green-400">₱{cartTotal()}</span>
      </div>
      
      {/* Edit Options Modal */}
      {editingItem && (
        <EditOptionsModal
          cartItem={editingItem}
          open={!!editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
} 