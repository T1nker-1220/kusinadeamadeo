import { Inter, Playfair_Display, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { ToastProvider } from "@/components/ui/Toast"
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { errorMonitor } from '@/lib/utils/error-monitoring'
import { NavigationWrapper } from "@/components/ui/NavigationWrapper"
import { MapPin, Clock, Phone, Facebook, Mail } from 'lucide-react'
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
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface-primary/80 backdrop-blur supports-[backdrop-filter]:bg-surface-primary/60">
              <NavigationWrapper />
            </header>

            <main className="flex-1">
              {children}
            </main>

            <footer className="mt-auto border-t border-white/10 bg-surface-elevated py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-orange">
                      <Clock className="h-5 w-5" />
                      Store Hours
                    </h3>
                    <div className="space-y-2 text-text-secondary">
                      <p>Open Daily</p>
                      <p className="font-medium">05:00 - 23:00</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-orange">
                      <MapPin className="h-5 w-5" />
                      Location
                    </h3>
                    <div className="space-y-2 text-text-secondary">
                      <p>107 i Purok 4 Dagatan,</p>
                      <p>Amadeo, Cavite</p>
                      <a 
                        href="https://maps.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-brand-orange hover:text-brand-orange-light"
                      >
                        View on Google Maps →
                      </a>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-orange">
                      <Phone className="h-5 w-5" />
                      Contact
                    </h3>
                    <div className="space-y-2 text-text-secondary">
                      <p>Phone: +63 960 508 8715</p>
                      <div className="flex gap-4 pt-2">
                        <a 
                          href="https://facebook.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-text-secondary transition-colors hover:text-brand-orange"
                          aria-label="Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                        <a 
                          href="mailto:kusinadeamadeo@gmail.com"
                          className="text-text-secondary transition-colors hover:text-brand-orange"
                          aria-label="Email"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 border-t border-white/10 pt-8 text-center">
                  <p className="text-sm text-text-secondary">
                    © {new Date().getFullYear()} Kusina De Amadeo. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
          <ToastProvider />
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  )
}
