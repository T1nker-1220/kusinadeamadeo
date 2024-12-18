"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AdminNav } from "@/components/ui/AdminNav"
import { Loading } from "@/components/ui/Loading"
import { LogOut, Menu, X, Home, ShoppingBag, Package, Settings } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { signOut } from "@/lib/supabase/auth"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils/cn"

const bottomNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session || session.user.email !== process.env.NEXT_PUBLIC_BUSINESS_EMAIL) {
          router.replace('/')
          return
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error checking admin status:', error)
        router.replace('/')
      }
    }

    checkAdmin()
  }, [supabase, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex min-h-screen bg-surface-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:bottom-0 md:z-50 md:flex md:w-64 md:flex-col border-r border-white/10 bg-surface-elevated">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="heading-display text-xl text-brand-orange">KDA</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-text-primary hover:text-brand-orange"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <AdminNav />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-surface-elevated md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-text-primary hover:text-brand-orange md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <span className="heading-display text-xl text-brand-orange">KDA</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-text-primary hover:text-brand-orange"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-16 left-0 bottom-0 z-50 w-64 overflow-y-auto bg-surface-elevated p-4 md:hidden"
            >
              <AdminNav />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="container max-w-7xl pt-24 pb-24 md:pt-8 md:pb-12 px-4">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-surface-elevated md:hidden">
        <div className="flex h-16 items-center justify-around px-4">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 min-w-[64px]",
                  "transition-colors duration-200",
                  isActive
                    ? "text-brand-orange"
                    : "text-text-secondary hover:text-brand-orange"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
} 