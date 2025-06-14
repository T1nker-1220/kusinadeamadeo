"use client";
import { useState, useRef, useEffect } from "react";
import ProductCard from "@/components/customers/menu/ProductCard";

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

type MenuPageClientProps = {
  categories: Category[];
  products: Product[];
  isStoreOpen: boolean;
};

export default function MenuPageClient({ categories, products, isStoreOpen }: MenuPageClientProps) {
  // --- Add refs for each category section ---
  const sectionRefs = useRef<Record<number | 'all', HTMLDivElement | null>>({ all: null });

  // Add 'All' as default
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');

  // --- Scroll to section on nav click ---
  const handleCategoryClick = (id: number | 'all') => {
    setActiveCategoryId(id);
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const ref = sectionRefs.current[id];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // --- Update active category on scroll (skip if 'All' is selected) ---
  useEffect(() => {
    if (activeCategoryId === 'all') return;
    const handleScroll = () => {
      let current = categories[0]?.id ?? 'all';
      categories.forEach((cat) => {
        const ref = sectionRefs.current[cat.id];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top < 120) current = cat.id;
        }
      });
      setActiveCategoryId(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, activeCategoryId]);

  return (
    <>
      <div className="sticky top-0 z-30 w-full bg-transparent">
        <div className="bg-surface/90 border-b border-border flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-accent py-3 px-0 sm:px-4 mb-8 w-full">
          {/* All Tab */}
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-5 py-2 rounded-full font-semibold transition-colors text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap
              ${activeCategoryId === 'all'
                ? 'bg-primary text-white shadow border border-primary'
                : 'bg-background-gradient-from/80 text-white border border-border hover:bg-primary/20'}
            `}
            aria-selected={activeCategoryId === 'all'}
            tabIndex={0}
            type="button"
          >
            All
          </button>
          {/* Category Tabs */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-5 py-2 rounded-full font-semibold transition-colors text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap
                ${cat.id === activeCategoryId
                  ? 'bg-primary text-white shadow border border-primary'
                  : 'bg-background-gradient-from/80 text-white border border-border hover:bg-primary/20'}
              `}
              aria-selected={cat.id === activeCategoryId}
              tabIndex={0}
              type="button"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <main className="px-0 sm:px-4 md:px-0 max-w-full mb-8">
        {/* Show all products if 'All' is selected */}
        {activeCategoryId === 'all' ? (
          <section className="mb-10" ref={el => { sectionRefs.current['all'] = el as HTMLDivElement | null; }}>
            <h2 className="text-3xl font-extrabold text-primary mb-2 mt-0 text-left px-1">
              All Products
            </h2>
            <div className="h-1 w-16 bg-primary rounded mb-6 ml-1" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} isStoreOpen={isStoreOpen} />
              ))}
            </div>
          </section>
        ) : (
          categories.map((category) => {
            const categoryProducts = products.filter((p) => p.category_id === category.id) || [];
            if (categoryProducts.length === 0) return null;

            return (
              <section
                key={category.id}
                ref={(el: HTMLDivElement | null) => { sectionRefs.current[category.id] = el; }}
                className="mb-10"
              >
                <h2 className="text-3xl font-extrabold text-primary mb-2 mt-0 text-left px-1">
                  {category.name}
                </h2>
                <div className="h-1 w-16 bg-primary rounded mb-6 ml-1" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {categoryProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} isStoreOpen={isStoreOpen} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>
    </>
  );
} 