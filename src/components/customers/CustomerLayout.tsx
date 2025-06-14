'use client';
import { usePathname } from 'next/navigation';
import Cart, { CartToggle } from "@/components/customers/Cart";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showCart = pathname === '/' || pathname === '/kiosk';

  return (
    <>
      {showCart && (
        <>
          <input type="checkbox" id="cart-toggle" className="hidden peer" />
          <CartToggle />
          <Cart />
          <label htmlFor="cart-toggle" className="fixed inset-0 bg-black/30 z-10 hidden peer-checked:block"></label>
        </>
      )}
      {children}
    </>
  );
}
