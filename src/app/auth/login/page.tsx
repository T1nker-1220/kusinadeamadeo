'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { signInWithGoogle, loading, error: authError } = useAuth();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorType = searchParams.get('error');
    if (errorType === 'auth_error') {
      setError('Authentication failed. Please try again.');
    } else if (errorType === 'db_error') {
      setError('Failed to create user profile. Please try again.');
    }
  }, [searchParams]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to Kusina de Amadeo</CardTitle>
          <CardDescription>Sign in to place your order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {(error || authError) && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error || authError?.message}
              </div>
            )}
            <Button
              variant="outline"
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
