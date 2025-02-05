'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStockManagement } from '@/hooks/use-stock-management';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface StockUpdateProps {
  productId: string;
  variantId: string;
  currentStock: number;
}

export function StockUpdate({
  productId,
  variantId,
  currentStock,
}: StockUpdateProps) {
  const [stockValue, setStockValue] = useState(currentStock);
  const { updateStock, isUpdating } = useStockManagement({
    productId,
    onSuccess: () => setStockValue(stockValue),
  });

  const handleStockChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setStockValue(numValue);
    }
  };

  const handleIncrement = () => {
    const newValue = stockValue + 1;
    setStockValue(newValue);
    updateStock(variantId, newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(0, stockValue - 1);
    setStockValue(newValue);
    updateStock(variantId, newValue);
  };

  const handleBlur = () => {
    if (stockValue !== currentStock) {
      updateStock(variantId, stockValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={isUpdating || stockValue <= 0}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={stockValue}
        onChange={(e) => handleStockChange(e.target.value)}
        onBlur={handleBlur}
        className="w-20 text-center"
        min={0}
        disabled={isUpdating}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={isUpdating}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
