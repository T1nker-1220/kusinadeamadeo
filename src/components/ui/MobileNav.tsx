"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, LogOut, ShoppingBag, Menu as MenuIcon, User } from "lucide-react"
import { Button } from "./Button"
import { useNavigation } from "@/lib/hooks/useNavigation"
import { cn } from "@/lib/utils/cn"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { signInWithGoogle, signOut } from "@/lib/supabase/auth"
import { motion, AnimatePresence } from "framer-motion"

const mobileNavItems = [
  {
    title: "Menu",
    href: "/menu",
    icon: MenuIcon,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const { isMobileMenuOpen, closeMobileMenu, toggleMobileMenu } = useNavigation()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }

    getUser()
  }, [supabase.auth])

  const handleSignIn = async () => {
    try {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50)
      }
      await signInWithGoogle()
      closeMobileMenu()
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50)
      }
      await signOut()
      closeMobileMenu()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleMenuToggle = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
    toggleMobileMenu()
  }

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu()
  }, [pathname, closeMobileMenu])

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-white/10 bg-surface-elevated/80 backdrop-blur-md md:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-text-primary hover:text-brand-orange md:hidden"
            onClick={handleMenuToggle}
          >
            <motion.div
              animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </motion.div>
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <span className="heading-display text-xl text-brand-orange">KDA</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-text-primary hover:text-brand-orange"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            {!loading && (
              user ? (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-text-primary hover:text-brand-orange"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Sign out</span>
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-text-primary hover:text-brand-orange"
                  onClick={handleSignIn}
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs overflow-y-auto bg-surface-elevated p-6 md:hidden"
            >
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <span className="heading-display text-xl text-brand-orange">KDA</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-text-primary hover:text-brand-orange"
                    onClick={closeMobileMenu}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-4 rounded-lg bg-surface-secondary p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {user.email}
                      </p>
                      {user.email === process.env.NEXT_PUBLIC_BUSINESS_EMAIL && (
                        <p className="text-xs text-brand-orange">Admin</p>
                      )}
                    </div>
                  </motion.div>
                )}

                <nav className="flex flex-col gap-2">
                  {mobileNavItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                            pathname === item.href
                              ? "bg-brand-orange/10 text-brand-orange"
                              : "text-text-secondary hover:bg-brand-orange/10 hover:text-brand-orange"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.title}
                        </Link>
                      </motion.div>
                    )}
                  )}

                  {user?.email === process.env.NEXT_PUBLIC_BUSINESS_EMAIL && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-brand-orange/10 hover:text-brand-orange"
                      >
                        <User className="h-5 w-5" />
                        Admin Dashboard
                      </Link>
                    </motion.div>
                  )}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-auto"
                >
                  <div className="rounded-lg bg-surface-secondary p-4">
                    <h3 className="heading-accent text-sm text-brand-orange mb-2">Store Hours</h3>
                    <p className="text-xs text-text-secondary">
                      Open Daily: {process.env.NEXT_PUBLIC_STORE_HOURS_OPEN} - {process.env.NEXT_PUBLIC_STORE_HOURS_CLOSE}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 