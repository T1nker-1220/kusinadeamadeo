'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="container flex h-screen w-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <div className="text-sm font-medium text-muted-foreground">Email</div>
            <div>{user.email}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-medium text-muted-foreground">Full Name</div>
            <div>{user.fullName}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-medium text-muted-foreground">Phone Number</div>
            <div>{user.phoneNumber || 'Not set'}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-medium text-muted-foreground">Address</div>
            <div>{user.address || 'Not set'}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-medium text-muted-foreground">Role</div>
            <div>{user.role}</div>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              await signOut();
              router.push('/auth/login');
            }}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
