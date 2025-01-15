import { Prisma } from '@prisma/client'

// User Types
export type User = Prisma.UserGetPayload<{
  include: {
    orders: true
    payments: true
  }
}>

export type UserCreateInput = Prisma.UserCreateInput
export type UserUpdateInput = Prisma.UserUpdateInput

// Category Types
export type Category = Prisma.CategoryGetPayload<{
  include: {
    products: true
  }
}>

export type CategoryCreateInput = Prisma.CategoryCreateInput
export type CategoryUpdateInput = Prisma.CategoryUpdateInput

// Product Types
export type Product = Prisma.ProductGetPayload<{
  include: {
    category: true
    variants: true
    orderItems: true
  }
}>

export type ProductCreateInput = Prisma.ProductCreateInput
export type ProductUpdateInput = Prisma.ProductUpdateInput

// Order Types
export type Order = Prisma.OrderGetPayload<{
  include: {
    user: true
    items: {
      include: {
        product: true
        variant: true
        addons: {
          include: {
            addon: true
          }
        }
      }
    }
    payment: true
  }
}>

export type OrderCreateInput = Prisma.OrderCreateInput
export type OrderUpdateInput = Prisma.OrderUpdateInput

// Payment Types
export type Payment = Prisma.PaymentGetPayload<{
  include: {
    order: true
    verifier: true
  }
}>

export type PaymentCreateInput = Prisma.PaymentCreateInput
export type PaymentUpdateInput = Prisma.PaymentUpdateInput

// Utility Types
export type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus, UserRole,
  VariantType
} from '@prisma/client'
