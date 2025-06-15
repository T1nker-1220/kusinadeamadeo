import { createClient } from '@/utils/supabase/server';
import StoreStatusProvider from '@/components/customers/StoreStatusProvider';
import Image from 'next/image';
import MenuContainer from '@/components/customers/menu/MenuContainer';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { History } from 'lucide-react';

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

export default async function NormalMenuPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Order History link */}
      <div className="w-full px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Menu</h1>
        <Link href="/normal-menu/order-history">
          <Button variant="secondary" className="text-sm">
            <History className="w-4 h-4 mr-2" />
            Order History
          </Button>
        </Link>
      </div>
      
      <StoreStatusProvider 
        categories={categories} 
        products={products} 
      />
    </div>
  );
}
