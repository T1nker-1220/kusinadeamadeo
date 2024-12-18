"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "./Button"
import { useNavigation } from "@/lib/hooks/useNavigation"
import { cn } from "@/lib/utils/cn"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { signInWithGoogle, signOut } from "@/lib/supabase/auth"

const mainNavItems = [
  {
    title: "Menu",
    href: "/menu",
  },
  {
    title: "Orders",
    href: "/orders",
  },
  {
    title: "Cart",
    href: "/cart",
  },
]

export function MainNav() {
  const pathname = usePathname()
  const { toggleMobileMenu } = useNavigation()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }

    getUser()
  }, [supabase.auth])

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

  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-white/10 bg-surface-elevated/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-text-primary hover:text-brand-orange"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <span className="heading-display text-xl text-brand-orange">KDA</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-orange",
                pathname === item.href
                  ? "text-brand-orange"
                  : "text-text-secondary"
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-text-primary hover:text-brand-orange"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          {!loading && (
            user ? (
              <>
                {user.email === process.env.NEXT_PUBLIC_BUSINESS_EMAIL && (
                  <Link href="/admin/dashboard">
                    <Button 
                      variant="ghost"
                      className="text-text-primary hover:text-brand-orange"
                    >
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-text-primary hover:text-brand-orange"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </>
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
      </nav>
    </header>
  )
} 