import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Cart, { CartToggle } from "@/components/customers/Cart"; // Remove from global layout
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '@/components/ThemeProvider';
import KioskInitializer from '@/components/KioskInitializer';
import KioskGuard from '@/components/KioskGuard';

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
        <ThemeProvider>
          <KioskInitializer />
          <KioskGuard />
          <Toaster position="bottom-center" />
          {/* CartToggle and Cart moved to CustomerLayout only */}
          {/* <input type="checkbox" id="cart-toggle" className="hidden peer" /> */}
          {/* <CartToggle /> */}
          {/* <Cart /> */}

          {/* <label htmlFor="cart-toggle" className="fixed inset-0 bg-black/30 z-10 hidden peer-checked:block"></label> */}

              {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
