"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCustomerStore } from "@/stores/customerStore"
import { ShoppingCart, Plus, Minus, X, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import CartPreview from "./CartPreview"
import Button from "@/components/ui/Button"

// Simple debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function ImprovedCart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    setGroupTag,
    clearCart,
    isKioskMode
  } = useCustomerStore()
  
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleStartOver = () => {
    clearCart()
    if (isKioskMode) {
      router.push('/kiosk-menu')
    } else {
      router.push('/normal-menu')
    }
  }

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

  // Sync local state with cart on mount and when cart changes (e.g., add/remove items)
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

  const renderCartContent = () => (
    <>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[calc(100vh-240px)] md:max-h-[calc(100vh-260px)]">
        {Object.entries(groupedCart).map(([groupName, groupData]) => (
          <div key={groupName} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-primary">{groupName}</h4>
              <span className="font-semibold text-green-400">Sub-total: ₱{groupData.subTotal}</span>
            </div>
            <div className="space-y-3">
              {groupData.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-slate-700 rounded-lg p-3 border border-slate-600 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      <Image
                        src={item.product.image_url || "/images/products/logo.png"}
                        alt={item.product.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover h-12 w-12"
                      />
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.product.name}</h4>
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
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, "decrease")}
                        className="w-8 h-8 flex items-center justify-center bg-slate-600 border border-slate-500 text-white hover:bg-orange-500 hover:border-orange-500 transition-colors rounded-md"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, "increase")}
                        className="w-8 h-8 flex items-center justify-center bg-slate-600 border border-slate-500 text-white hover:bg-orange-500 hover:border-orange-500 transition-colors rounded-md"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-green-400 font-bold">₱{item.itemTotal * item.quantity}</span>
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
                          className="w-28 text-xs px-2 py-1 rounded bg-slate-800 border border-slate-600 text-white focus:border-primary focus:outline-none"
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
      <div className="mt-6 pt-4 border-t border-slate-600">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-white">Grand Total:</span>
          <span className="text-2xl font-bold text-green-400">₱{cartTotal()}</span>
        </div>
        <Link href={isKioskMode ? "/kiosk-menu/checkout" : "/normal-menu/checkout"}>
          <Button variant="success" fullWidth className="text-lg py-3">
            Proceed to Checkout
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        {isKioskMode && (
          <Button variant="danger" fullWidth className="mt-2" onClick={handleStartOver}>
            Start New Order / Clear Cart
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Floating Cart Button - Desktop */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <div className="relative group">
          <CartPreview />
          
          <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`} onClick={() => setIsCartOpen(false)}></div>
          
          <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-800 border-l border-slate-600 shadow-2xl p-6 transform transition-transform duration-300 z-50 ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                <h3 className="text-xl font-bold text-white">Your Order</h3>
              </div>
              {cart.length > 0 && (
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {getTotalItems()}
                </span>
              )}
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-px bg-slate-600 mb-6"></div>
            
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-10 h-10 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-lg mb-2">Your cart is empty</p>
                  <p className="text-slate-500 text-sm">Add some delicious items to get started!</p>
                </div>
              </div>
            ) : (
              renderCartContent()
            )}
          </div>
          
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-full p-4 h-16 w-16 ${
              cart.length > 0 ? "animate-bounce" : ""
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse min-w-[20px] text-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Floating Cart Button - Mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsCartOpen(true)}
          className={`relative bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-2xl rounded-full p-3 h-14 w-14 ${
            cart.length > 0 ? "animate-bounce" : ""
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse min-w-[18px] text-center">
              {getTotalItems()}
            </span>
          )}
        </button>
        
        <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} onClick={() => setIsCartOpen(false)}></div>
        
        <div className={`fixed bottom-0 left-0 right-0 h-[80vh] bg-slate-800 border-t border-slate-600 rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-300 z-50 ${
          isCartOpen ? "translate-y-0" : "translate-y-full"
        }`}>
          {/* Mobile cart header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl font-bold text-white">Your Order</h3>
            </div>
            {cart.length > 0 && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                {getTotalItems()}
              </span>
            )}
            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="h-px bg-slate-600 mb-6"></div>
          
          {/* Mobile cart content - same structure as desktop */}
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-slate-400 text-lg mb-2">Your cart is empty</p>
                <p className="text-slate-500 text-sm">Add some delicious items to get started!</p>
              </div>
            </div>
          ) : (
            renderCartContent()
          )}
        </div>
      </div>
    </>
  )
}