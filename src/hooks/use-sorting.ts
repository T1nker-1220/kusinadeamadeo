import { useState, useMemo } from 'react';

type SortOrder = 'asc' | 'desc';

interface UseSortingProps<T, K extends keyof T> {
  items: T[];
  defaultSortKey: K;
  defaultSortOrder?: SortOrder;
}

interface SortingResult<T, K extends keyof T> {
  sortedItems: T[];
  sortKey: K;
  sortOrder: SortOrder;
  setSortKey: (key: K) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
}

export function useSorting<T, K extends keyof T>({
  items,
  defaultSortKey,
  defaultSortOrder = 'asc',
}: UseSortingProps<T, K>): SortingResult<T, K> {
  const [sortKey, setSortKey] = useState<K>(defaultSortKey);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      const modifier = sortOrder === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return modifier * aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return modifier * (aValue - bValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return modifier * (aValue.getTime() - bValue.getTime());
      }

      if (aValue === bValue) {
        return 0;
      }

      return modifier * (aValue < bValue ? -1 : 1);
    });
  }, [items, sortKey, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return {
    sortedItems,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
    toggleSortOrder,
  };
}
