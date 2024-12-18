import { NavigationWrapper } from "@/components/ui/NavigationWrapper"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavigationWrapper />
      {children}
    </>
  )
} 