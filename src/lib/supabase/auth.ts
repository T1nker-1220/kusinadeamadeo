import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Provider } from '@supabase/supabase-js'

export const signInWithGoogle = async () => {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google' as Provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  return { data, error }
}

export const signOut = async () => {
  const supabase = createClientComponentClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getSession = async () => {
  const supabase = createClientComponentClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
} 