import { createClient } from '@/utils/supabase/server';
import MenuPageClient from '@/components/customers/MenuPageClient';

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

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*, options (*)')
    .eq('is_available', true);

  if (categoriesError || productsError) {
    console.error(categoriesError || productsError);
    return <p className="text-center text-red-500 mt-10">Error loading menu. Please try again later.</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="text-center py-8">
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">Kusina De Amadeo</h1>
        <p className="text-lg text-neutral-600 mt-2">Your 24/7 Food Buddy</p>
      </header>
      <MenuPageClient categories={categories || []} products={products || []} />
    </div>
  );
}
