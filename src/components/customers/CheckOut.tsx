'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerStore, CartItem } from '@/stores/customerStore';
import { createClient } from '@/utils/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useKiosk } from '@/hooks/useKiosk';

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

export default function CheckOut() {
  const { cart, cartTotal, clearCart } = useCustomerStore();
  const router = useRouter();
  const { isKiosk } = useKiosk();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'PayAtStore'>('GCash');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !fullName || !phone) {
      setError('Please fill all fields.');
      return;
    }
    if (paymentMethod === 'GCash' && !paymentProof) {
      setError('Please upload GCash payment proof.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let paymentProofUrl = null;
      if (paymentMethod === 'GCash' && paymentProof) {
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, paymentProof, { upsert: true });
        if (uploadError) throw uploadError;
        await new Promise((resolve) => setTimeout(resolve, 1500));
        paymentProofUrl = await createSignedUrlWithRetry(supabase, filePath);
      }
      const orderData = {
        customer_name: fullName,
        customer_phone: phone,
        total_price: cartTotal(),
        payment_proof_url: paymentProofUrl,
        payment_method: paymentMethod,
        status: paymentMethod === 'PayAtStore' ? 'Pending Confirmation' : 'Preparing',
      };
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
        group_tag: item.groupTag || null,
      }));
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);
      if (itemsError) throw itemsError;
      clearCart();
      if (isKiosk) {
        router.push('/kiosk');
      } else if (paymentMethod === 'PayAtStore') {
        router.push(`/order/${newOrder.id}/status`);
      } else {
        router.push('/order-success');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-2 sm:px-4 md:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-primary">Your Order</h2>
          <div className="space-y-3">
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
        </Card>
        {/* Payment and Details Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <h2 className="text-xl font-semibold text-primary">Payment Method</h2>
              <div className="mt-2 flex gap-4">
                <label><input type="radio" value="GCash" checked={paymentMethod === 'GCash'} onChange={() => setPaymentMethod('GCash')} /> Pay with GCash</label>
                <label><input type="radio" value="PayAtStore" checked={paymentMethod === 'PayAtStore'} onChange={() => setPaymentMethod('PayAtStore')} /> Pay at Store</label>
              </div>
            </div>
            <Input
              label="Full Name"
              type="text"
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              id="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            {/* Conditionally render GCash details and upload */}
            {paymentMethod === 'GCash' && (
              <div>
                <div className="mt-2 p-4 bg-accent/10 border border-accent rounded-lg">
                  <p>Please pay via GCash:</p>
                  <p className="font-bold">Name: John Nathaniel M.</p>
                  <p className="font-bold">Number: 09605088715</p>
                  <p className="mt-2 text-sm text-danger">Strictly no payment, no serving of order.</p>
                </div>
                <label htmlFor="paymentProof" className="block font-medium mb-1 mt-4">Upload GCash Screenshot</label>
                <input
                  type="file"
                  id="paymentProof"
                  onChange={handleFileChange}
                  required={paymentMethod === 'GCash'}
                  accept="image/*"
                  className="w-full mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
                />
              </div>
            )}
            {error && <p className="text-danger">{error}</p>}
            <Button type="submit" loading={isSubmitting} fullWidth>
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
}
