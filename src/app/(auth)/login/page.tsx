"use client"

import Image from "next/image"
import { GoogleButton } from "@/components/auth/GoogleButton"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative flex w-full max-w-[850px] overflow-hidden rounded-xl bg-surface-elevated shadow-xl">
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="heading-display text-3xl">Welcome Back</h1>
              <p className="body-text mt-2 text-text-secondary">
                Sign in to continue to Kusina De Amadeo
              </p>
            </div>
            <div className="mt-8">
              <GoogleButton />
            </div>
          </div>
        </div>
        <div className="hidden md:block md:w-1/2">
          <div className="relative h-full w-full">
            <Image
              src="/images/login.jpg"
              alt="Login background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
} 