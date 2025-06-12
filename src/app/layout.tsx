import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cart, { CartToggle } from "@/components/customers/Cart";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kusina de Amadeo - Order Online",
  description: "Authentic Filipino food, ready for pickup. Order online now!",
  manifest: "/favicon_io/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="bottom-center" />
        {/* This checkbox system controls the cart visibility */}
        <input type="checkbox" id="cart-toggle" className="hidden peer" />
        <CartToggle />
        <Cart />

        {/* This overlay dims the background when the cart is open */}
        <label htmlFor="cart-toggle" className="fixed inset-0 bg-black/30 z-10 hidden peer-checked:block"></label>

        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}
