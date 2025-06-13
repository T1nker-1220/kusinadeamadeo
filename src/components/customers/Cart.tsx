'use client';

import { useCustomerStore } from '@/stores/customerStore';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Plus, Minus, Trash2, ShoppingCart, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCustomerStore();

  return (
    <aside className="fixed top-0 right-0 h-full w-full max-w-xs bg-[var(--color-surface)]/80 backdrop-blur-lg shadow-2xl p-0 transform translate-x-full peer-checked:translate-x-0 transition-transform z-20 flex flex-col border-l border-[var(--color-border)]">
      <header className="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-lg">
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--color-foreground)] flex items-center gap-2">
          <ShoppingCart size={22} /> Your Order
        </h2>
      </header>
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <ShoppingBag size={48} className="text-[var(--color-muted)]" />
          <p className="text-[var(--color-muted)] text-lg font-medium">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-4 flex-grow overflow-y-auto px-4 pb-40">
            {cart.map(item => (
              <Card key={item.cartItemId} className="flex items-center gap-3 p-4 shadow-md border-[var(--color-border)]">
                <div className="relative">
                  <Image
                    src={item.product.image_url || '/images/products/logo.png'}
                    alt={item.product.name}
                    width={56}
                    height={56}
                    className="rounded-lg object-cover h-14 w-14 border-2 border-[var(--color-border)] shadow-sm"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-base text-[var(--color-foreground)] truncate">{item.product.name}</p>
                  {item.selectedOptions.length > 0 && (
                    <ul className="text-xs text-[var(--color-muted)]">
                      {item.selectedOptions.map((opt, idx) => (
                        <li key={idx}>{opt.group_name}: {opt.name}{opt.additional_price > 0 && ` (+₱${opt.additional_price})`}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-[var(--color-success)] font-bold mt-1">₱{item.itemTotal}</p>
                  <input
                    type="text"
                    placeholder="Name for this item?"
                    defaultValue={item.groupTag}
                    onBlur={(e) => useCustomerStore.getState().setGroupTag(item.cartItemId, e.target.value)}
                    className="mt-1 p-1 text-xs border rounded w-full"
                  />
                </div>
                <div className="flex flex-col items-center gap-2 ml-2">
                  <Button onClick={() => updateQuantity(item.cartItemId, 'increase')} variant="secondary" className="p-1 w-8 h-8" aria-label="Increase quantity">
                    <Plus size={16} />
                  </Button>
                  <span className="font-semibold">{item.quantity}</span>
                  <Button onClick={() => updateQuantity(item.cartItemId, 'decrease')} variant="secondary" className="p-1 w-8 h-8" aria-label="Decrease quantity">
                    <Minus size={16} />
                  </Button>
                </div>
                <Button onClick={() => removeFromCart(item.cartItemId)} variant="danger" className="p-1 w-8 h-8 ml-2" aria-label="Remove item">
                  <Trash2 size={16} />
                </Button>
              </Card>
            ))}
          </div>
          <footer className="fixed bottom-0 left-0 w-full max-w-xs p-5 border-t border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-lg z-30">
            <div className="flex justify-between items-center font-bold text-xl mb-3">
              <span>Total:</span>
              <span className="text-[var(--color-success)]">₱{cartTotal()}</span>
            </div>
            <Link href="/checkout" className="block w-full">
              <Button variant="success" fullWidth iconLeft={<ShoppingCart size={18} />} aria-label="Proceed to checkout">
                Checkout
              </Button>
            </Link>
          </footer>
        </>
      )}
    </aside>
  );
}

// A separate component for the cart toggle button
export function CartToggle() {
  const cartCount = useCustomerStore(state => state.cartCount());
  return (
    <label htmlFor="cart-toggle" className="fixed top-4 right-4 z-30 bg-[var(--color-surface)]/90 backdrop-blur-lg p-3 rounded-full shadow-lg cursor-pointer flex items-center">
      <ShoppingCart size={22} />
      {cartCount > 0 && (
        <span className="bg-[var(--color-danger)] text-white text-xs rounded-full px-1.5 py-0.5 absolute -top-1 -right-1 min-w-[20px] text-center">
          {cartCount}
        </span>
      )}
    </label>
  );
} 