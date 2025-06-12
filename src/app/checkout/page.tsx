'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerStore, CartItem } from '@/stores/customerStore';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

async function createSignedUrlWithRetry(supabase: any, filePath: string, maxRetries = 5, delayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .createSignedUrl(filePath, 31536000);
    if (data && data.signedUrl) return data.signedUrl;
    await new Promise(res => setTimeout(res, delayMs));
  }
  throw new Error('File not found for signed URL after multiple retries');
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCustomerStore();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !paymentProof || !fullName || !phone) {
      setError('Please fill all fields and upload payment proof.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload payment proof to the NEW, PRIVATE bucket
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, paymentProof, { upsert: true });
      console.log('Upload data:', uploadData, 'Upload error:', uploadError);

      if (uploadError) throw uploadError;

      // Add a short delay to ensure file is available
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 2. Create a long-lived SIGNED URL instead of a public one, with retry
      const paymentProofUrl = await createSignedUrlWithRetry(supabase, filePath);

      // 3. Prepare order data for insertion
      const orderData = {
        customer_name: fullName,
        customer_phone: phone,
        total_price: cartTotal(),
        payment_proof_url: paymentProofUrl,
      };

      // 4. Insert data into 'orders' and 'order_items' tables
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (orderError) throw orderError;

      const orderItemsData = cart.map((item: CartItem) => ({
        order_id: newOrder.id,
        product_name: item.product.name,
        quantity: item.quantity,
        item_price: item.itemTotal,
        selected_options: item.selectedOptions.reduce((acc, opt) => {
          acc[opt.group_name] = opt.name;
          return acc;
        }, {} as Record<string, string>),
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);
      
      if (itemsError) throw itemsError;

      // 5. Success: Clear cart and redirect
      clearCart();
      router.push('/order-success');

    } catch (err: any) {
      console.error(err);
      setError('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Order</h2>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            {cart.map(item => (
              <div key={item.cartItemId} className="flex justify-between">
                <span>{item.quantity}x {item.product.name}</span>
                <span>₱{item.itemTotal * item.quantity}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₱{cartTotal()}</span>
            </div>
          </div>
        </div>

        {/* Payment and Details Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Payment Details</h2>
              <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p>Please pay via GCash:</p>
                <p className="font-bold">Name: John Nathaniel M.</p>
                <p className="font-bold">Number: 09605088715</p>
                <p className="mt-2 text-sm text-red-600">Strictly no payment, no serving of order.</p>
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block font-medium">Full Name</label>
              <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full p-2 border rounded-md mt-1"/>
            </div>

            <div>
              <label htmlFor="phone" className="block font-medium">Phone Number</label>
              <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full p-2 border rounded-md mt-1"/>
            </div>

            <div>
              <label htmlFor="paymentProof" className="block font-medium">Upload GCash Screenshot</label>
              <input type="file" id="paymentProof" onChange={handleFileChange} required accept="image/*" className="w-full mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"/>
            </div>
            
            {error && <p className="text-red-500">{error}</p>}
            
            <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 