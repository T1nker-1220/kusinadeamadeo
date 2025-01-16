'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          redirect('/auth/login');
        }

        setLoading(false);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError('Error loading dashboard. Please try again.');
        setLoading(false);
      }
    }

    checkUser();
  }, [supabase.auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Customer Dashboard</h1>
      {/* Add dashboard content here */}
    </div>
  );
}
