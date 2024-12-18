export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          price: number
          category: string
          image_url: string | null
          is_available: boolean
          variants: Json[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          price: number
          category: string
          image_url?: string | null
          is_available?: boolean
          variants?: Json[] | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          image_url?: string | null
          is_available?: boolean
          variants?: Json[] | null
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          items: Json[]
          total: number
          status: string
          payment_method: string
          payment_status: string
          delivery_method: string
          delivery_address: string | null
          delivery_notes: string | null
          receipt_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          items: Json[]
          total: number
          status?: string
          payment_method: string
          payment_status?: string
          delivery_method: string
          delivery_address?: string | null
          delivery_notes?: string | null
          receipt_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          items?: Json[]
          total?: number
          status?: string
          payment_method?: string
          payment_status?: string
          delivery_method?: string
          delivery_address?: string | null
          delivery_notes?: string | null
          receipt_id?: string
        }
      }
      customers: {
        Row: {
          id: string
          created_at: string
          email: string
          phone: string
          name: string
          address: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          phone: string
          name: string
          address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          phone?: string
          name?: string
          address?: string | null
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
      [_ in never]: never
    }
  }
} 