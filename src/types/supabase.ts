export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ProductCategory = 
  | 'BUDGET_MEALS'
  | 'SILOG_MEALS'
  | 'ALA_CARTE'
  | 'BEVERAGES'
  | 'SPECIAL_ORDERS'

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price: number | null
          category: ProductCategory
          image_url: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price?: number | null
          category: ProductCategory
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          base_price?: number | null
          category?: ProductCategory
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          price: number
          size?: string | null
          flavor?: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          price: number
          size?: string | null
          flavor?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          price?: number
          size?: string | null
          flavor?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_addons: {
        Row: {
          id: string
          name: string
          price: number
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_available_addons: {
        Row: {
          product_id: string
          addon_id: string
          created_at: string
        }
        Insert: {
          product_id: string
          addon_id: string
          created_at?: string
        }
        Update: {
          product_id?: string
          addon_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      product_category: ProductCategory
    }
  }
} 