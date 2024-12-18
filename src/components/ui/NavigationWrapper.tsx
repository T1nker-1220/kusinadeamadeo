"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, LogOut, Menu } from "lucide-react"
import { Button } from "./Button"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { signInWithGoogle, signOut } from "@/lib/supabase/auth"
import { cn } from "@/lib/utils/cn"

const navItems = [
  {
    title: "Menu",
    href: "/menu",
  },
  {
    title: "Orders",
    href: "/orders",
  },
]

export function NavigationWrapper() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isAdminRoute) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface-primary/80 backdrop-blur supports-[backdrop-filter]:bg-surface-primary/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side - Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
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

        {/* Center - Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center gap-8">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={pathname === item.href ? "text-brand-orange" : "text-text-primary hover:text-brand-orange"}
            >
              <Link href={item.href}>
                {item.title}
              </Link>
            </Button>
          ))}
        </div>

        {/* Right side - Cart and Account */}
        <div className="flex items-center gap-2">
          {/* Desktop Cart and Account */}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              asChild
              className={pathname === "/cart" ? "text-brand-orange" : "text-text-primary hover:text-brand-orange"}
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  {user.email === process.env.NEXT_PUBLIC_BUSINESS_EMAIL && (
                    <Link href="/admin/dashboard" className="text-xs text-brand-orange hover:text-brand-orange-light">
                      Admin
                    </Link>
                  )}
                  <div className="relative group">
                    <Image
                      src={user.user_metadata?.avatar_url || '/images/default-avatar.png'}
                      alt={user.user_metadata?.full_name || 'User avatar'}
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8 object-cover border border-white/10"
                    />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-surface-elevated rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="px-4 py-2 text-sm text-text-secondary">
                        {user.user_metadata?.full_name || user.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-sm text-left text-text-primary hover:bg-surface-secondary flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSignIn}
                  className="text-text-primary hover:text-brand-orange"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Button>
              )
            )}
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              asChild
              className={pathname === "/cart" ? "text-brand-orange" : "text-text-primary hover:text-brand-orange"}
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {!loading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="relative focus:outline-none"
                  >
                    <Image
                      src={user.user_metadata?.avatar_url || '/images/default-avatar.png'}
                      alt={user.user_metadata?.full_name || 'User avatar'}
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8 object-cover border border-white/10"
                    />
                  </button>

                  {isMobileMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 py-2 bg-surface-elevated rounded-md shadow-lg z-50">
                        <div className="px-4 py-2 text-sm text-text-secondary border-b border-white/10">
                          {user.user_metadata?.full_name || user.email}
                        </div>
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "block px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary",
                              pathname === item.href && "text-brand-orange"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                        {user.email === process.env.NEXT_PUBLIC_BUSINESS_EMAIL && (
                          <Link
                            href="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-brand-orange hover:bg-surface-secondary"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            handleSignOut()
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-text-primary hover:bg-surface-secondary flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSignIn}
                  className="text-text-primary hover:text-brand-orange"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 