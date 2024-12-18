"use client"

import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/Button"

export function GoogleButton() {
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
  }

  return (
    <Button
      onClick={handleSignIn}
      className="w-full bg-surface-secondary hover:bg-surface-secondary/80"
    >
      <Image
        src="/images/google.svg"
        alt="Google"
        width={20}
        height={20}
        className="mr-2"
      />
      Continue with Google
    </Button>
  )
} 