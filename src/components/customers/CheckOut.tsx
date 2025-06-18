'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerStore, CartItem } from '@/stores/customerStore';
import { createClient } from '@/utils/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { saveLastOrder, saveOrderToHistory } from '@/utils/localStorage';
import { showError } from '@/utils/toast';
import EditableOrderSummary from './EditableOrderSummary';

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
  const { cart, cartTotal, clearCart, isKioskMode } = useCustomerStore();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'PayAtStore'>(isKioskMode ? 'PayAtStore' : 'GCash');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !fullName) {
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
      // --- AVAILABILITY VALIDATION (new) ---
      // 1. Get all unique product IDs from the cart
      const productIds = [...new Set(cart.map(item => item.product.id))];

      // 2. Fetch the current availability status of these products from the database
      const { data: currentProducts, error: productsError } = await supabase
        .from('products')
        .select('id, name, is_available')
        .in('id', productIds);
      
      if (productsError) throw productsError;

      // 3. Find any item in the cart that is now unavailable
      const unavailableItems = cart.filter(cartItem => {
        const dbProduct = currentProducts.find(p => p.id === cartItem.product.id);
        // An item is unavailable if it's not in the DB anymore or its flag is false
        return !dbProduct || !dbProduct.is_available;
      });

      // 4. If there are unavailable items, stop the checkout and inform the user.
      if (unavailableItems.length > 0) {
        const itemNames = unavailableItems.map(item => item.product.name).join(', ');
        showError(`Sorry, ${itemNames} just became unavailable. Please remove it from your cart.`);
        setError(`Some items are unavailable. Please review your order.`);
        setIsSubmitting(false);
        return; // Stop the entire process
      }
      // --- END OF NEW VALIDATION LOGIC ---

      // If we reach here, all items are available. Proceed with the existing logic.
      let paymentProofUrl = null;
      if (paymentMethod === 'GCash' && paymentProof) {
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, paymentProof, { upsert: true });
        if (uploadError) throw uploadError;
        paymentProofUrl = await createSignedUrlWithRetry(supabase, filePath);
      }
      const orderData = {
        customer_name: fullName,
        total_price: cartTotal(),
        payment_proof_url: paymentProofUrl,
        payment_method: paymentMethod,
        status: 'Pending Confirmation', // Both payment methods require admin confirmation
      };
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      if (orderError) throw orderError;
      const orderItemsData = cart.map((item: CartItem) => ({
        order_id: newOrder.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        item_price: item.itemTotal,
        selected_options: item.selectedOptions.reduce((acc, opt) => {
          acc[opt.group_name] = opt.name;
          return acc;
        }, {} as Record<string, string>),
        group_tag: item.groupTag || item.product.owner || 'Unassigned',
      }));
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);
      if (itemsError) throw itemsError;
      if (!isKioskMode) {
        saveLastOrder(cart);
        // Save order to history for normal menu users
        saveOrderToHistory({
          id: newOrder.id.toString(),
          orderNumber: newOrder.id.toString(),
          placedAt: new Date().toISOString(),
          totalPrice: cartTotal(),
          paymentMethod: paymentMethod,
          customerName: fullName,
          customerPhone: '', // Empty since we removed phone number
          items: cart,
          status: orderData.status,
        });
      }
      clearCart();
      setOrderPlaced(true);
      if (isKioskMode) {
        router.replace(`/kiosk-menu/success?orderId=${newOrder.id}`);
      } else {
        // Personal device orders go to success page first
        router.push(`/normal-menu/order-success?orderId=${newOrder.id}&method=${paymentMethod}`);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-2 sm:px-4 md:px-8 pt-0 md:pt-30 pb-24 md:pb-8">
      <div className="mb-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="!py-1 !px-3 text-xs"
          onClick={() => router.push(isKioskMode ? '/kiosk' : '/normal-menu')}
        >
          ← Back to Menu
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-primary">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Editable Order Summary */}
        {!orderPlaced && (
          <EditableOrderSummary />
        )}
        {/* Payment and Details Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <h2 className="text-xl font-semibold text-primary">Payment Method</h2>
              <div className="mt-2 flex gap-4">
                {!isKioskMode && (
                  <label><input type="radio" value="GCash" checked={paymentMethod === 'GCash'} onChange={() => setPaymentMethod('GCash')} /> Pay with GCash</label>
                )}
                <label><input type="radio" value="PayAtStore" checked={paymentMethod === 'PayAtStore'} onChange={() => setPaymentMethod('PayAtStore')} /> Pay at Store</label>
              </div>
              {isKioskMode && (
                <p className="text-sm text-muted-foreground mt-2">
                  Only "Pay at Store" is available on kiosk devices for security reasons.
                </p>
              )}
              {paymentMethod === 'PayAtStore' && (
                <p className="mt-2 text-sm text-danger font-semibold">
                  Reminder: "No Pay, No Serve." Please be ready to pay the cashier before we prepare your food.
                </p>
              )}
            </div>
            <Input
              label="Full Name / Group Name"
              type="text"
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
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
            {error && <div className="text-danger text-sm">{error}</div>}
            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting || orderPlaced}>
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
}
