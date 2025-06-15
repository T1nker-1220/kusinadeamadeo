import Image from 'next/image';
import Button from '@/components/ui/Button';
import Link from 'next/link';

// This tells Next.js to always fetch fresh data, so your menu is always up-to-date
export const revalidate = 0;

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background-gradient-from to-background-gradient-to px-4">
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <div className="mb-6">
          <Image
            src="/images/logo.png"
            alt="Kusina De Amadeo Logo"
            width={120}
            height={120}
            className="rounded-full shadow-lg border-4 border-primary bg-white"
            priority
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2 text-center">Kusina De Amadeo</h1>
        <p className="text-lg text-white/90 mb-8 text-center max-w-xs">
          Your 24/7 Food Buddy. Order authentic Filipino meals, drinks, and more—ready for pickup, anytime!
        </p>
        <Link href="/normal-menu" className="w-full">
          <Button variant="primary" fullWidth className="text-lg py-3">
            View Menu
          </Button>
        </Link>
      </div>
    </main>
  );
}
