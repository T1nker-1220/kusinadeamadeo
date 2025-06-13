'use client';
import { useRef, useEffect } from 'react';
import Button from './Button';

type Category = { id: number; name: string };

type CategoryNavProps = {
  categories: Category[];
  activeCategoryId: number | null;
  onCategoryClick: (id: number) => void;
};

export default function CategoryNav({ categories, activeCategoryId, onCategoryClick }: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);

  // Scroll active chip into view
  useEffect(() => {
    if (!navRef.current) return;
    const activeBtn = navRef.current.querySelector('[data-active="true"]');
    if (activeBtn && 'scrollIntoView' in activeBtn) {
      (activeBtn as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeCategoryId]);

  return (
    <div
      ref={navRef}
      className="sticky top-0 z-30 bg-[var(--color-background)] border-b border-orange-100 overflow-x-auto flex gap-2 px-2 py-3 sm:px-4 md:px-8 scrollbar-hide"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant="chip"
          active={cat.id === activeCategoryId}
          onClick={() => onCategoryClick(cat.id)}
          data-active={cat.id === activeCategoryId}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
} 