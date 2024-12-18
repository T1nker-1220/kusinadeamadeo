"use client"

import React from 'react'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Hero background"
            fill
            className="object-cover brightness-[0.2]"
            priority
            sizes="100vw"
            quality={85}
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-brand-orange">
              Welcome to Kusina De Amadeo
            </h1>
            <p className="body-text text-lg text-text-secondary">
              Your favorite local restaurant in Amadeo, Cavite. Experience delicious Filipino cuisine made with love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                className="bg-brand-orange hover:bg-brand-orange-light text-white"
              >
                <Link href="/menu">View Menu</Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                className="border-brand-orange text-brand-orange hover:bg-brand-orange/10"
              >
                <Link href="/orders">Track Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="glass-orange p-8 rounded-lg space-y-3">
              <h3 className="heading-accent text-xl text-brand-orange">Store Hours</h3>
              <p className="body-text text-text-secondary">
                Open Daily: {process.env.NEXT_PUBLIC_STORE_HOURS_OPEN} - {process.env.NEXT_PUBLIC_STORE_HOURS_CLOSE}
              </p>
            </div>
            <div className="glass-orange p-8 rounded-lg space-y-3">
              <h3 className="heading-accent text-xl text-brand-orange">Location</h3>
              <p className="body-text text-text-secondary">
                {process.env.NEXT_PUBLIC_BUSINESS_ADDRESS}
              </p>
            </div>
            <div className="glass-orange p-8 rounded-lg space-y-3">
              <h3 className="heading-accent text-xl text-brand-orange">Contact</h3>
              <p className="body-text text-text-secondary">
                Phone: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-surface-elevated">
        <div className="container px-4">
          <h2 className="heading-display text-3xl text-center mb-12 text-brand-orange">
            Why Choose Us?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="featured-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <span role="img" aria-label="Fresh Ingredients" className="text-2xl">
                  🍳
                </span>
              </div>
              <h3 className="heading-accent text-lg text-brand-orange">Fresh Ingredients</h3>
              <p className="body-text text-text-secondary">
                We use only the freshest ingredients to ensure quality in every dish.
              </p>
            </div>
            <div className="featured-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <span role="img" aria-label="Fast Service" className="text-2xl">
                  ⚡
                </span>
              </div>
              <h3 className="heading-accent text-lg text-brand-orange">Fast Service</h3>
              <p className="body-text text-text-secondary">
                Quick preparation without compromising quality.
              </p>
            </div>
            <div className="featured-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <span role="img" aria-label="Made with Love" className="text-2xl">
                  💖
                </span>
              </div>
              <h3 className="heading-accent text-lg text-brand-orange">Made with Love</h3>
              <p className="body-text text-text-secondary">
                Every dish is prepared with care and passion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
