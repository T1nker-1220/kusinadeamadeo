"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow flex justify-center items-center h-14 border-b border-orange-200">
      <Image
        src="/images/logo.png"
        alt="Kusina De Amadeo Logo"
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
        priority
      />
    </header>
  );
}
