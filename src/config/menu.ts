import { ProductCategory } from '@/types/product'

export const MENU_CATEGORIES = [
  {
    id: 'all',
    name: 'All Items',
    description: 'View all menu items',
  },
  {
    id: 'Budget Meals',
    name: 'Budget Meals',
    description: 'Affordable meal options from ₱35-₱60',
    priceRange: '₱35-₱60'
  },
  {
    id: 'Silog Meals',
    name: 'Silog Meals',
    description: 'Filipino breakfast favorites',
    priceRange: '₱85-₱100'
  },
  {
    id: 'Ala Carte',
    name: 'Ala Carte',
    description: 'Individual dishes',
    priceRange: '₱20-₱60'
  },
  {
    id: 'Beverages',
    name: 'Beverages',
    description: 'Drinks and refreshments',
    priceRange: '₱29-₱39'
  },
  {
    id: 'Special Orders',
    name: 'Special Orders',
    description: 'Custom and bulk orders',
    priceRange: 'Varies'
  }
] as const;

export type MenuCategory = typeof MENU_CATEGORIES[number]['id'];

export const DEFAULT_ADDONS = [
  {
    name: 'Siomai',
    price: 5.00,
  },
  {
    name: 'Shanghai',
    price: 5.00,
  },
  {
    name: 'Skinless',
    price: 10.00,
  },
  {
    name: 'Egg',
    price: 15.00,
  },
  {
    name: 'Hotdog',
    price: 15.00,
  },
  {
    name: 'Extra Sauce',
    price: 5.00,
  },
] as const 