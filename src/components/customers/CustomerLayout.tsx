import Cart, { CartToggle } from "@/components/customers/Cart";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Cart system controls */}
      <input type="checkbox" id="cart-toggle" className="hidden peer" />
      <CartToggle />
      <Cart />
      {/* Overlay dims background when cart is open */}
      <label htmlFor="cart-toggle" className="fixed inset-0 bg-black/30 z-10 hidden peer-checked:block"></label>
      {children}
    </>
  );
}
