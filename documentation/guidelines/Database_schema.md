// Core Tables
interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  role: 'admin' | 'customer';
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  isAvailable: boolean;
  allowsAddons: boolean;
}

interface ProductVariant {
  id: string;
  productId: string;
  type: 'size' | 'flavor';
  name: string;
  price: number;
}

interface GlobalAddon {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

interface Order {
  id: string;
  userId: string;
  receiptId: string; // e.g., AE20
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentMethod: 'gcash' | 'cash';
  paymentStatus: 'pending' | 'verified';
  totalAmount: number;
  createdAt: Date;
}

// Payment Related Tables
interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'gcash' | 'cash';
  status: 'pending' | 'verified' | 'rejected';
  referenceNumber?: string;
  screenshotUrl?: string;
  verifiedBy?: string;
  verificationTimestamp?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentVerificationLog {
  id: string;
  paymentId: string;
  adminId: string;
  action: 'verify' | 'reject';
  notes?: string;
  timestamp: Date;
}

// Rate Limiting Tables
interface RateLimit {
  id: string;
  userId: string;
  endpoint: string;
  count: number;
  window: string;
  lastReset: Date;
}

// Error Logging Tables
interface ErrorLog {
  id: string;
  type: 'VALIDATION_ERROR' | 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR' | 'PAYMENT_ERROR' | 'ORDER_ERROR' | 'SYSTEM_ERROR';
  code: string;
  message: string;
  details?: Record<string, unknown>;
  userId?: string;
  timestamp: Date;
  stackTrace?: string;
}

// Audit Trail Tables
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'order' | 'payment' | 'product' | 'user';
  entityId: string;
  changes: Record<string, unknown>;
  timestamp: Date;
}

// Database Indexes
const indexes = {
  users: [
    { name: 'email_idx', columns: ['email'] },
    { name: 'role_idx', columns: ['role'] }
  ],
  orders: [
    { name: 'user_id_idx', columns: ['userId'] },
    { name: 'status_idx', columns: ['status'] },
    { name: 'created_at_idx', columns: ['createdAt'] }
  ],
  payments: [
    { name: 'order_id_idx', columns: ['orderId'] },
    { name: 'status_idx', columns: ['status'] },
    { name: 'reference_number_idx', columns: ['referenceNumber'] }
  ],
  rateLimits: [
    { name: 'user_endpoint_idx', columns: ['userId', 'endpoint'] },
    { name: 'window_idx', columns: ['lastReset'] }
  ],
  errorLogs: [
    { name: 'type_idx', columns: ['type'] },
    { name: 'timestamp_idx', columns: ['timestamp'] }
  ]
};

// RLS Policies
const rlsPolicies = {
  orders: {
    select: `auth.uid() = userId OR auth.role() = 'admin'`,
    insert: `auth.uid() = userId`,
    update: `auth.role() = 'admin'`,
    delete: `auth.role() = 'admin'`
  },
  payments: {
    select: `auth.uid() = orders.userId OR auth.role() = 'admin'`,
    insert: `auth.uid() = orders.userId`,
    update: `auth.role() = 'admin'`,
    delete: false
  }
};
