import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
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

    // Get user data and verify admin role
    const { data: userData, error: dbError } = await supabase
      .from('User')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError || userData?.role !== 'ADMIN') {
      console.error('Access denied or error fetching user data:', dbError);
      redirect('/');
    }

    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Admin Dashboard
            </h1>

            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-medium text-gray-900">Admin Controls</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">User Management</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage user accounts and roles
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Orders</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      View and manage customer orders
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Products</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage product catalog
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Admin page error:', error);
    redirect('/auth/login');
  }
}
