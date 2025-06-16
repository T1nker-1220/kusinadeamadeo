import { SelectedOption } from '@/stores/customerStore';

export type ProductInfo = {
  id: number;
  name: string;
  base_price: number;
  image_url: string | null;
  is_available?: boolean;
};

export function generateSignature(product: ProductInfo, options: SelectedOption[] = []): string {
  return `${product.id}-${options.map(o => `${o.group_name}:${o.name}`).sort().join('-')}`;
}

export function calculateItemTotal(product: ProductInfo, options: SelectedOption[] = []): number {
  const optionsTotal = options.reduce((sum, opt) => sum + opt.additional_price, 0);
  return product.base_price + optionsTotal;
} 