"use client";
import { useState, useRef, useEffect } from "react";
import CategoryNav from "@/components/ui/CategoryNav";
import ProductCard from "@/components/customers/ProductCard";

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
};

export default function MenuPageClient({ categories, products }: MenuPageClientProps) {
  // --- Add refs for each category section ---
  const sectionRefs = categories.reduce((acc, cat) => {
    acc[cat.id] = useRef<HTMLDivElement>(null);
    return acc;
  }, {} as Record<number, React.RefObject<HTMLDivElement>>);

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(categories[0]?.id || null);

  // --- Scroll to section on nav click ---
  const handleCategoryClick = (id: number) => {
    const ref = sectionRefs[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // --- Update active category on scroll ---
  useEffect(() => {
    const handleScroll = () => {
      let current = categories[0]?.id || null;
      categories.forEach((cat) => {
        const ref = sectionRefs[cat.id];
        if (ref && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top < 120) current = cat.id;
        }
      });
      setActiveCategoryId(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, sectionRefs]);

  return (
    <>
      <CategoryNav
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryClick={handleCategoryClick}
      />
      <main className="px-2 sm:px-4 md:px-0 max-w-full">
        {categories.map((category) => {
          const categoryProducts = products.filter((p) => p.category_id === category.id) || [];
          if (categoryProducts.length === 0) return null;

          return (
            <section
              key={category.id}
              ref={sectionRefs[category.id]}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-orange-600 border-b-4 border-orange-300 pb-2 mb-6 px-1">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {categoryProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
} 