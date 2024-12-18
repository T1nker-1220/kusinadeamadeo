import { redirect } from "next/navigation"
import { getSession } from "@/lib/supabase/auth"

interface AuthGuardProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export async function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const { session, error } = await getSession()

  if (error || !session) {
    redirect("/login")
  }

  if (adminOnly && session.user.email !== process.env.NEXT_PUBLIC_BUSINESS_EMAIL) {
    redirect("/")
  }

  return <>{children}</>
} 