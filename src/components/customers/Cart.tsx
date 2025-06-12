'use client';

import { useCustomerStore } from '@/stores/customerStore';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCustomerStore();

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-4 transform translate-x-full peer-checked:translate-x-0 transition-transform z-20">
      <h2 className="text-xl font-bold border-b pb-2">Your Order</h2>
      
      {cart.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty.</p>
      ) : (
        <>
          <div className="mt-4 space-y-4 flex-grow overflow-y-auto h-[calc(100vh-200px)]">
            {cart.map(item => (
              <div key={item.cartItemId} className="flex items-center space-x-3">
                <Image
                  src={item.product.image_url || '/images/products/logo.png'}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="rounded-md object-cover h-12 w-12"
                />
                <div className="flex-grow">
                  <p className="font-semibold text-sm">{item.product.name}</p>
                  {item.selectedOptions.length > 0 && (
                    <ul className="text-xs text-gray-500">
                      {item.selectedOptions.map((opt, idx) => (
                        <li key={idx}>{opt.group_name}: {opt.name}{opt.additional_price > 0 && ` (+₱${opt.additional_price})`}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-green-600 font-bold">₱{item.itemTotal}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQuantity(item.cartItemId, 'decrease')} className="px-2 border rounded">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, 'increase')} className="px-2 border rounded">+</button>
                </div>
                <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-500 hover:text-red-700">✕</button>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₱{cartTotal()}</span>
            </div>
            <Link href="/checkout" className="block text-center mt-4 w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// A separate component for the cart toggle button
export function CartToggle() {
    const cartCount = useCustomerStore(state => state.cartCount());
    return (
        <label htmlFor="cart-toggle" className="fixed top-4 right-4 z-30 bg-white p-3 rounded-full shadow-lg cursor-pointer">
            🛒 <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 absolute -top-1 -right-1">{cartCount}</span>
        </label>
    );
} 