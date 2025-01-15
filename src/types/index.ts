// Core type definitions
export type User = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  role: 'admin' | 'customer';
  createdAt: Date;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  isAvailable: boolean;
  allowsAddons: boolean;
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Form types
export type LoginForm = {
  email: string;
};

export type ProfileForm = {
  fullName: string;
  phoneNumber: string;
  address: string;
};
