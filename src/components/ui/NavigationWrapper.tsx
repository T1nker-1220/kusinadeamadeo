"use client"

import { usePathname } from 'next/navigation'
import { MainNav } from "./MainNav"
import { MobileNav } from "./MobileNav"

export function NavigationWrapper() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return null
  }

  return (
    <>
      <MainNav />
      <MobileNav />
    </>
  )
} 