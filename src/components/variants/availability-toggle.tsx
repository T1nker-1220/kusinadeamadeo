'use client';

import { Switch } from '@/components/ui/switch';
import { useAvailabilityManagement } from '@/hooks/use-availability-management';

interface AvailabilityToggleProps {
  productId: string;
  variantId: string;
  isAvailable: boolean;
}

export function AvailabilityToggle({
  productId,
  variantId,
  isAvailable,
}: AvailabilityToggleProps) {
  const { toggleAvailability, isUpdating } = useAvailabilityManagement({
    productId,
  });

  const handleToggle = (checked: boolean) => {
    toggleAvailability(variantId, checked);
  };

  return (
    <Switch
      checked={isAvailable}
      onCheckedChange={handleToggle}
      disabled={isUpdating}
      aria-label="Toggle variant availability"
    />
  );
}
