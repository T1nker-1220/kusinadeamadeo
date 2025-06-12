import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="text-center max-w-xl mx-auto p-8 mt-20">
      <h1 className="text-4xl font-bold text-green-600">Order Received!</h1>
      <p className="mt-4 text-lg">Thank you for your purchase. We are now preparing your order.</p>
      <p className="mt-2">You can wait for your order at our store. Please be ready to present your name.</p>
      <Link href="/" className="mt-8 inline-block bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg">
        Back to Menu
      </Link>
    </div>
  );
} 