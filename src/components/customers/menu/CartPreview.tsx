"use client"

import { useCustomerStore } from "@/stores/customerStore"

export default function CartPreview() {
  const { cart } = useCustomerStore()
  
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }
  
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.itemTotal * item.quantity), 0)
  }

  return (
    <div className="absolute bottom-full right-0 mb-2 w-80 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 transform transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">Quick Preview</h3>
        <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
          {getTotalItems()}
        </span>
      </div>

      {cart.length === 0 ? (
        <p className="text-slate-400 text-sm">Your cart is empty</p>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {cart.slice(0, 3).map((item) => (
            <div key={item.cartItemId} className="flex justify-between items-center text-sm">
              <span className="text-white truncate">{item.product.name}</span>
              <span className="text-green-400 ml-2">₱{item.itemTotal * item.quantity}</span>
            </div>
          ))}
          {cart.length > 3 && (
            <p className="text-slate-400 text-xs">+{cart.length - 3} more items</p>
          )}
        </div>
      )}

      {cart.length > 0 && (
        <>
          <div className="h-px bg-slate-600 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">Total:</span>
            <span className="font-bold text-green-400">₱{getTotalPrice()}</span>
          </div>
        </>
      )}

      <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-800"></div>
    </div>
  )
}