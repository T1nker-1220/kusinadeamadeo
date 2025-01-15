import type { User } from '@/types/database';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface AuthError {
  message: string;
  code?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }: {
      data: { session: Session | null },
      error: SupabaseAuthError | null
    }) => {
      if (error) {
        setState(prev => ({ ...prev, loading: false, error: { message: error.message } }));
        return;
      }

      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setState(prev => ({ ...prev, user: null, loading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: data,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error fetching user:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: { message: 'Failed to fetch user profile' }
      }));
    }
  }

  async function signInWithGoogle() {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: { message: 'Failed to sign in with Google' }
      }));
      throw error;
    }
  }

  async function signOut() {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: { message: 'Failed to sign out' }
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false, user: null }));
    }
  }

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signInWithGoogle,
    signOut,
    isAdmin: state.user?.role === 'ADMIN'
  };
}
