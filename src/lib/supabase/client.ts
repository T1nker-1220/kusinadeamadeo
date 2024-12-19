import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SupabaseConfigError'
  }
}

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL')
  throw new SupabaseConfigError('Supabase URL is not configured')
}

if (!supabaseAnonKey) {
  console.error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
  throw new SupabaseConfigError('Supabase anonymous key is not configured')
}

// Create and export the Supabase client with enhanced settings
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'kusinadeamadeo-admin',
      },
    },
    // Add connection pool settings
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)

// Enhanced connection check with retries
export const checkDatabaseConnection = async (retries = 3): Promise<boolean> => {
  let attempt = 0
  
  while (attempt < retries) {
    try {
      console.log(`Checking database connection (attempt ${attempt + 1}/${retries})...`)
      
      // Try to get the current timestamp from the database
      const { data, error } = await supabase
        .from('customers')
        .select('created_at')
        .limit(1)
        .single()
      
      if (error) {
        // If it's a permission error, try auth status instead
        if (error.code === '42501') {
          const { data: { session }, error: authError } = await supabase.auth.getSession()
          if (!authError) {
            console.log('Database connection successful (via auth)')
            return true
          }
        }
        
        console.error(`Database connection check failed (attempt ${attempt + 1}):`, error)
        attempt++
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // Exponential backoff
          continue
        }
        return false
      }
      
      console.log('Database connection successful')
      return true
    } catch (error) {
      console.error(`Error checking database connection (attempt ${attempt + 1}):`, error)
      attempt++
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        continue
      }
      return false
    }
  }
  
  return false
}

// Initialize connection check with retries
checkDatabaseConnection().then(isConnected => {
  if (!isConnected) {
    console.error('Failed to establish database connection after retries')
  }
})

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    console.error('Supabase error:', error.message)
    return error.message
  }
  console.error('Unknown Supabase error:', error)
  return 'An unexpected error occurred'
}

// Helper function to check if error is a connection error
export const isConnectionError = (error: any): boolean => {
  const connectionErrors = [
    'connection refused',
    'timeout',
    'network error',
    'failed to fetch'
  ]
  return connectionErrors.some(msg => error?.message?.toLowerCase().includes(msg))
}

// Export connection status check
export const getConnectionStatus = async (): Promise<{
  isConnected: boolean
  error?: string
}> => {
  try {
    const isConnected = await checkDatabaseConnection(1) // Single attempt for status check
    return { isConnected }
  } catch (error) {
    return {
      isConnected: false,
      error: handleSupabaseError(error)
    }
  }
}

// Helper function to handle Supabase timestamps
export const fromSupabaseTimestamp = (timestamp: string | null): Date | null => {
  if (!timestamp) return null
  try {
    return new Date(timestamp)
  } catch (error) {
    console.error('Error parsing Supabase timestamp:', error)
    return null
  }
}

// Helper function to format date for Supabase
export const toSupabaseTimestamp = (date: Date | null): string | null => {
  if (!date) return null
  try {
    return date.toISOString()
  } catch (error) {
    console.error('Error formatting date for Supabase:', error)
    return null
  }
}

// Helper function to check if Supabase client is initialized
export const isSupabaseInitialized = (): boolean => {
  try {
    if (!supabase) {
      console.error('Supabase client is null')
      return false
    }
    if (typeof supabase.from !== 'function') {
      console.error('Supabase client is missing from() method')
      return false
    }
    return true
  } catch (error) {
    console.error('Error checking Supabase initialization:', error)
    return false
  }
}