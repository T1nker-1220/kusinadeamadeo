import CustomerLayout from '@/components/customers/CustomerLayout';
import { createClient } from '@/utils/supabase/server';
import MenuPageClient from '@/components/customers/MenuPageClient';

export const revalidate = 0;

type Option = { id: number; group_name: string; name: string; additional_price: number; };
type Product = { id: number; name: string; description: string | null; base_price: number; image_url: string | null; category_id: number; options: Option[]; };
type Category = { id: number; name: string };

export default async function KioskPage() {
  const supabase = createClient();

  const [
    { data: categories, error: categoriesError },
    { data: products, error: productsError },
    { data: storeSettings, error: settingsError }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('products').select('*, options (*)').eq('is_available', true),
    supabase.from('store_settings').select('is_open').eq('id', 1).single()
  ]);

  if (categoriesError || productsError || settingsError) {
    console.error(categoriesError || productsError || settingsError);
    return <p className="text-center text-red-500 mt-10">Error loading menu. Please try again later.</p>;
  }

  const isStoreOpen = storeSettings?.is_open ?? true;

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="text-center py-8">
          <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">Welcome to Kusina De Amadeo</h1>
          <p className="text-lg text-neutral-600 mt-2">Place your order here!</p>
        </header>

        {!isStoreOpen && (
          <div className="max-w-4xl mx-auto p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Store Currently Closed</p>
            <p>We are not accepting online orders at this time. Please check back later!</p>
          </div>
        )}

        <MenuPageClient 
          categories={categories || []} 
          products={products || []}
          isStoreOpen={isStoreOpen}
        />
      </div>
    </CustomerLayout>
  );
} 