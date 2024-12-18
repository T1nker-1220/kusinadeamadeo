# Phase 3: Cart, Checkout & Orders

## Step 1: Cart Implementation

### 1.1 Cart Types
```typescript
// src/types/cart.ts
export interface CartItem {
  id: string
  productId: string
  name: string
  basePrice: number
  quantity: number
  imageUrl: string
  category: string
  variants?: {
    size?: {
      name: string
      priceAdjustment: number
    }
    addOns?: Array<{
      name: string
      price: number
    }>
    flavorOptions?: string[]
  }
  specialInstructions?: string
  totalPrice: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
  lastUpdated: string
}
```

### 1.2 Cart Store
```typescript
// src/stores/useCart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, CartItem } from '@/types/cart'
import { getCurrentTime } from '@/lib/utils'

interface CartStore {
  cart: Cart
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateVariants: (id: string, variants: CartItem['variants']) => void
  updateInstructions: (id: string, instructions: string) => void
  clearCart: () => void
  isValidCheckoutTime: () => boolean
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        subtotal: 0,
        itemCount: 0,
        lastUpdated: getCurrentTime(),
      },

      addItem: (item) => {
        set((state) => {
          const existingItem = state.cart.items.find(
            (i) => 
              i.productId === item.productId && 
              JSON.stringify(i.variants) === JSON.stringify(item.variants)
          )

          if (existingItem) {
            return {
              cart: {
                ...state.cart,
                items: state.cart.items.map((i) =>
                  i.id === existingItem.id
                    ? { 
                        ...i, 
                        quantity: i.quantity + 1,
                        totalPrice: calculateItemTotal(i, i.quantity + 1)
                      }
                    : i
                ),
                subtotal: calculateCartTotal(state.cart.items),
                itemCount: state.cart.itemCount + 1,
                lastUpdated: getCurrentTime(),
              },
            }
          }

          const newItem = {
            ...item,
            id: crypto.randomUUID(),
            quantity: 1,
            totalPrice: calculateItemTotal(item, 1)
          }

          return {
            cart: {
              ...state.cart,
              items: [...state.cart.items, newItem],
              subtotal: calculateCartTotal([...state.cart.items, newItem]),
              itemCount: state.cart.itemCount + 1,
              lastUpdated: getCurrentTime(),
            },
          }
        })
      },

      removeItem: (id) => {
        set((state) => {
          const item = state.cart.items.find((i) => i.id === id)
          if (!item) return state

          const updatedItems = state.cart.items.filter((i) => i.id !== id)
          return {
            cart: {
              ...state.cart,
              items: updatedItems,
              subtotal: calculateCartTotal(updatedItems),
              itemCount: state.cart.itemCount - item.quantity,
              lastUpdated: getCurrentTime(),
            },
          }
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return

        set((state) => {
          const updatedItems = state.cart.items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                quantity,
                totalPrice: calculateItemTotal(item, quantity)
              }
            }
            return item
          })

          return {
            cart: {
              ...state.cart,
              items: updatedItems,
              subtotal: calculateCartTotal(updatedItems),
              itemCount: calculateItemCount(updatedItems),
              lastUpdated: getCurrentTime(),
            },
          }
        })
      },

      updateVariants: (id, variants) => {
        set((state) => {
          const updatedItems = state.cart.items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                variants,
                totalPrice: calculateItemTotal({ ...item, variants }, item.quantity)
              }
            }
            return item
          })

          return {
            cart: {
              ...state.cart,
              items: updatedItems,
              subtotal: calculateCartTotal(updatedItems),
              lastUpdated: getCurrentTime(),
            },
          }
        })
      },

      updateInstructions: (id, instructions) => {
        set((state) => ({
          cart: {
            ...state.cart,
            items: state.cart.items.map((i) =>
              i.id === id ? { ...i, specialInstructions: instructions } : i
            ),
            lastUpdated: getCurrentTime(),
          },
        }))
      },

      clearCart: () => {
        set({
          cart: {
            items: [],
            subtotal: 0,
            itemCount: 0,
            lastUpdated: getCurrentTime(),
          },
        })
      },

      isValidCheckoutTime: () => {
        const now = new Date()
        const hour = now.getHours()
        return hour >= 8 && hour < 22 // 8 AM to 10 PM
      },
    }),
    {
      name: 'kda-cart-storage',
    }
  )
)

const calculateItemTotal = (
  item: Pick<CartItem, 'basePrice' | 'variants'>, 
  quantity: number
): number => {
  let total = item.basePrice

  if (item.variants) {
    if (item.variants.size) {
      total += item.variants.size.priceAdjustment
    }
    if (item.variants.addOns) {
      total += item.variants.addOns.reduce((sum, addon) => sum + addon.price, 0)
    }
  }

  return total * quantity
}

const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.totalPrice, 0)
}

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
```

## Step 2: Order System

### 2.1 Order Types
```typescript
// src/types/order.ts
export interface OrderItem extends Omit<CartItem, 'id'> {
  orderId: string
  unitPrice: number
}

export interface Order {
  id: string
  receiptId: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: OrderItem[]
  subtotal: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  payment: {
    method: 'gcash' | 'cash'
    status: 'pending' | 'paid' | 'failed'
    amount: number
    gcashNumber?: string
    gcashName?: string
    reference?: string
  }
  delivery: {
    address: string
    instructions?: string
    status: 'pending' | 'assigned' | 'in-transit' | 'delivered'
  }
  specialInstructions?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderInput {
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: CartItem[]
  payment: {
    method: 'gcash' | 'cash'
  }
  delivery: {
    address: string
    instructions?: string
  }
  specialInstructions?: string
}
```

### 2.2 Order Database Schema
```sql
-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id TEXT UNIQUE NOT NULL,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment JSONB NOT NULL,
  delivery JSONB NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')
  )
);

-- Create orders_audit table
CREATE TABLE orders_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function to generate receipt ID
CREATE OR REPLACE FUNCTION generate_receipt_id()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  numbers TEXT := '0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  -- Generate 2 random letters
  FOR i IN 1..2 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  -- Generate 2 random numbers
  FOR i IN 1..2 LOOP
    result := result || substr(numbers, floor(random() * length(numbers) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### 2.3 Order API Routes
```typescript
// src/app/api/orders/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Verify user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const input: CreateOrderInput = await req.json()
  
  // Validate operating hours
  const now = new Date()
  const hour = now.getHours()
  if (hour < 8 || hour >= 22) {
    return NextResponse.json(
      { error: 'Orders can only be placed between 8 AM and 10 PM' },
      { status: 400 }
    )
  }
  
  // Create order
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      receipt_id: await generateReceiptId(),
      customer: input.customer,
      items: input.items,
      subtotal: calculateOrderTotal(input.items),
      payment: {
        method: input.payment.method,
        status: 'pending',
        amount: calculateOrderTotal(input.items),
        ...(input.payment.method === 'gcash' && {
          gcashNumber: process.env.NEXT_PUBLIC_GCASH_NUMBER,
          gcashName: process.env.NEXT_PUBLIC_GCASH_NAME,
        }),
      },
      delivery: input.delivery,
      special_instructions: input.specialInstructions,
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
  
  // Send confirmation email
  await resend.emails.send({
    from: process.env.NEXT_PUBLIC_BUSINESS_EMAIL!,
    to: input.customer.email,
    subject: `Order Confirmation - ${order.receipt_id}`,
    react: OrderConfirmationEmail({ order }),
  })
  
  return NextResponse.json(order)
}

async function generateReceiptId(): Promise<string> {
  const supabase = createRouteHandlerClient({ cookies })
  
  while (true) {
    const { data, error } = await supabase.rpc('generate_receipt_id')
    if (error) throw error
    
    // Verify uniqueness
    const { data: existing } = await supabase
      .from('orders')
      .select('receipt_id')
      .eq('receipt_id', data)
      .single()
    
    if (!existing) return data
  }
}
```

## Step 3: Email Templates

### 3.1 Order Confirmation Email
```typescript
// src/components/emails/OrderConfirmation.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { Order } from '@/types/order'

export const OrderConfirmationEmail = ({
  order,
}: {
  order: Order
}) => {
  const previewText = `Order Confirmation - ${order.receiptId}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            Thank you for your order!
          </Heading>
          
          <Section style={section}>
            <Text style={text}>
              Your order has been received and is being processed.
            </Text>
            
            <Text style={text}>
              Order Receipt ID: <strong>{order.receiptId}</strong>
            </Text>
            
            {order.payment.method === 'gcash' ? (
              <>
                <Text style={text}>
                  Please send your GCash payment to:
                </Text>
                <Text style={text}>
                  Number: {order.payment.gcashNumber}
                  <br />
                  Name: {order.payment.gcashName}
                  <br />
                  Amount: ₱{order.payment.amount.toFixed(2)}
                </Text>
                <Text style={text}>
                  After payment, please send your payment screenshot to our Facebook Messenger.
                </Text>
              </>
            ) : (
              <Text style={text}>
                Please prepare the exact amount of ₱{order.payment.amount.toFixed(2)} for cash payment.
              </Text>
            )}
            
            <Section style={orderDetails}>
              <Heading style={h2}>Order Details</Heading>
              {order.items.map((item) => (
                <Text key={item.productId} style={text}>
                  {item.quantity}x {item.name} - ₱{item.totalPrice.toFixed(2)}
                  {item.variants && (
                    <Text style={variantText}>
                      {item.variants.size && `Size: ${item.variants.size.name}`}
                      {item.variants.addOns?.map((addon) => (
                        ` • ${addon.name} (+₱${addon.price})`
                      ))}
                    </Text>
                  )}
                </Text>
              ))}
              
              <Text style={total}>
                Total: ₱{order.subtotal.toFixed(2)}
              </Text>
            </Section>
            
            <Text style={text}>
              Delivery Address:
              <br />
              {order.delivery.address}
            </Text>
            
            {order.delivery.instructions && (
              <Text style={text}>
                Delivery Instructions:
                <br />
                {order.delivery.instructions}
              </Text>
            )}
          </Section>
          
          <Text style={footer}>
            If you have any questions, please contact us at {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
}

const section = {
  padding: '24px',
  backgroundColor: '#f6f9fc',
  borderRadius: '12px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '0 0 24px',
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '0 0 16px',
}

const orderDetails = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
}

const variantText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  marginLeft: '16px',
}

const total = {
  color: '#333',
  fontSize: '18px',
  fontWeight: '600',
  margin: '16px 0 0',
  borderTop: '1px solid #e0e0e0',
  paddingTop: '16px',
}

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  marginTop: '32px',
}
