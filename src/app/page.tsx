import { createClient } from '@/utils/supabase/server'; // ADJUST PATH if needed
import ProductCard from '@/components/customers/ProductCard'; // Import the new component

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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-orange-50/50 min-h-screen">
      <header className="text-center my-8">
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">Kusina De Amadeo</h1>
        <p className="text-lg text-neutral-600 mt-2">Your 24/7 Food Buddy</p>
      </header>

      <main>
        {categories?.map((category) => {
          const categoryProducts = products?.filter(p => p.category_id === category.id) || [];
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.id} className="mb-12">
              <h2 className="text-3xl font-bold text-orange-600 border-b-4 border-orange-300 pb-2 mb-6">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
