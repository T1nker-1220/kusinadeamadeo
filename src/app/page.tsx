import CustomerLayout from '@/components/customers/CustomerLayout';
import { createClient } from '@/utils/supabase/server';
import StoreStatusProvider from '@/components/customers/StoreStatusProvider';

// This tells Next.js to always fetch fresh data, so your menu is always up-to-date
export const revalidate = 0;

// Define types for our data for better code safety
type Option = {
  id: number;
  group_name: string;
  name: string;
  additional_price: number;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  category_id: number;
  options: Option[];
};

type Category = { id: number; name: string };

export default async function Home() {
  const supabase = createClient();

  const [
    { data: categories, error: categoriesError },
    { data: products, error: productsError }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('products').select('*, options (*)').eq('is_available', true)
  ]);

  if (categoriesError || productsError) {
    console.error(categoriesError || productsError);
    return <p className="text-center text-danger mt-10">Error loading menu. Please try again later.</p>;
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-background">
        <StoreStatusProvider categories={categories || []} products={products || []} />
      </div>
    </CustomerLayout>
  );
}
