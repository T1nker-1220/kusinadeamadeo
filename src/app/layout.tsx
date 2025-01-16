import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Kusina de Amadeo",
  description: "Your favorite local restaurant",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head />
      <body className="min-h-screen bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
