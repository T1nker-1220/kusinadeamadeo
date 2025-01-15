import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = cookies();

  // Create Supabase client with proper cookie handling
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  });

  try {
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Authentication error:', userError);
      redirect('/auth/login');
    }

    // Get user data
    const { data: userData, error: dbError } = await supabase
      .from('User')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError) {
      console.error('Error fetching user data:', dbError);
      redirect('/auth/login');
    }

    // If user is admin, redirect to admin dashboard
    if (userData?.role === 'ADMIN') {
      redirect('/admin');
    }

    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {userData?.fullName}!
            </h1>

            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-medium text-gray-900">Your Information</h2>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userData?.phoneNumber || 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userData?.address || 'Not set'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    redirect('/auth/login');
  }
}
