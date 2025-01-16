'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    });
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'db_error':
        return 'There was an error creating your account. Please try again.';
      case 'auth_error':
        return 'Authentication failed. Please try again.';
      case 'missing_code':
        return 'Invalid authentication attempt. Please try again.';
      case 'no_user':
        return 'No user information received. Please try again.';
      default:
        return 'An unknown error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{getErrorMessage(error)}</span>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">Login to Kusina de Amadeo</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
