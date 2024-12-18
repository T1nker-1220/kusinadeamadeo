import { Inter, Playfair_Display, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { ToastProvider } from "@/components/ui/Toast"
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { errorMonitor } from '@/lib/utils/error-monitoring'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata = {
  title: 'Kusina De Amadeo',
  description: 'Your favorite local food store in Amadeo, Cavite',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize error monitoring
  if (typeof window !== 'undefined') {
    errorMonitor.init()
  }

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-surface-primary font-sans text-text-primary antialiased">
        <ErrorBoundary>
          {children}
          <ToastProvider />
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  )
}
