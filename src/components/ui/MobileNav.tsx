"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, User, LogOut, Home, ShoppingBag, Utensils } from "lucide-react"
import { Button } from "./Button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils/cn"

interface MobileNavProps {
  user: any
  onSignIn: () => void
  onSignOut: () => void
}

const mobileNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Menu",
    href: "/menu",
    icon: Utensils,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingBag,
    requiresAuth: true,
  },
  {
    title: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
]

export function MobileNav({ user, onSignIn, onSignOut }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50 md:hidden text-text-primary hover:text-brand-orange"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-surface-elevated md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image
                      src="/images/logo.png"
                      alt="KDA Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                      priority
                    />
                    <span className="text-brand-orange font-display text-xl font-bold">KDA</span>
                  </Link>
                  {user && (
                    <div className="flex items-center gap-2">
                      {user.email === process.env.NEXT_PUBLIC_BUSINESS_EMAIL && (
                        <span className="text-xs text-brand-orange">Admin</span>
                      )}
                      <Image
                        src={user.user_metadata?.avatar_url || '/images/default-avatar.png'}
                        alt={user.user_metadata?.full_name || 'User avatar'}
                        width={32}
                        height={32}
                        className="rounded-full w-8 h-8 object-cover border border-white/10"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* User Info */}
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4"
                    >
                      <div className="p-4 rounded-lg bg-surface-secondary">
                        <p className="text-sm font-medium truncate">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Links */}
                  <nav className="p-4 space-y-1">
                    {mobileNavItems.map((item, index) => {
                      // Skip protected routes if user is not authenticated
                      if (item.requiresAuth && !user) return null

                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Button
                            variant="ghost"
                            asChild
                            className={cn(
                              "w-full justify-start gap-3 text-base font-medium",
                              pathname === item.href 
                                ? "bg-brand-orange/10 text-brand-orange" 
                                : "text-text-primary hover:bg-surface-secondary"
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            <Link href={item.href} className="flex items-center gap-3">
                              <Icon className="h-5 w-5" />
                              {item.title}
                            </Link>
                          </Button>
                        </motion.div>
                      )
                    })}

                    {/* Admin Link */}
                    {user?.email === process.env.NEXT_PUBLIC_BUSINESS_EMAIL && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: mobileNavItems.length * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          asChild
                          className="w-full justify-start gap-3 text-base font-medium text-text-primary hover:bg-surface-secondary"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/admin/dashboard" className="flex items-center gap-3">
                            <User className="h-5 w-5" />
                            Admin Dashboard
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </nav>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                  {/* Auth Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {user ? (
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-base font-medium text-text-primary hover:bg-surface-secondary"
                        onClick={() => {
                          onSignOut()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-base font-medium text-text-primary hover:bg-surface-secondary"
                        onClick={() => {
                          onSignIn()
                          setIsOpen(false)
                        }}
                      >
                        <User className="h-5 w-5" />
                        Sign In
                      </Button>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 