
import { createClient } from '@/utils/supabase/server';
import MenuContainer from '@/components/customers/menu/MenuContainer';

export const revalidate = 0;

type Option = { id: number; group_name: string; name: string; additional_price: number; is_available: boolean; };
type Product = { id: number; name: string; description: string | null; base_price: number; image_url: string | null; category_id: number; is_available: boolean; options: Option[]; };
type Category = { id: number; name: string };

export default async function KioskPage() {
  const supabase = createClient();

  const [
    { data: categories, error: categoriesError },
    { data: products, error: productsError },
    { data: storeSettings, error: settingsError }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('products').select('*, options (*)'),
    supabase.from('store_settings').select('is_open, estimated_wait_time').eq('id', 1).single()
  ]);

  // Debug: Log fetched products to see if is_available is present
  console.log('Kiosk products:', products?.slice(0, 2)); // Log first 2 products

  if (categoriesError || productsError || settingsError) {
    console.error(categoriesError || productsError || settingsError);
    return <p className="text-center text-danger mt-10">Error loading menu. Please try again later.</p>;
  }

  const isStoreOpen = storeSettings?.is_open ?? true;

  return (
      <div className="min-h-screen bg-background">
        {!isStoreOpen && (
          <div className="mx-auto p-2 mb-4 bg-danger/10 border-l-4 border-danger text-danger">
            <p className="font-bold text-sm">Store Currently Closed</p>
            <p className="text-sm">We are not accepting online orders at this time. Please check back later!</p>
          </div>
        )}

        <MenuContainer 
          categories={categories || []} 
          products={products || []}
          isStoreOpen={isStoreOpen}
          waitTime={storeSettings?.estimated_wait_time}
        />
      </div>
  );
} 