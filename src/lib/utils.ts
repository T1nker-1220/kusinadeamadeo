import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency to PHP
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
}

// Format date to local PH time
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
  }).format(date);
}

// Generate receipt ID (2 letters + 2 numbers)
export function generateReceiptId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letterPart = Array(2)
    .fill(null)
    .map(() => letters.charAt(Math.floor(Math.random() * letters.length)))
    .join('');
  const numberPart = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');
  return `${letterPart}${numberPart}`;
}

// Validate business hours
export function isWithinBusinessHours(date: Date = new Date()): boolean {
  const hours = date.getHours();
  const openingHour = parseInt(process.env.NEXT_PUBLIC_STORE_HOURS_OPEN?.split(':')[0] ?? '5');
  const closingHour = parseInt(process.env.NEXT_PUBLIC_STORE_HOURS_CLOSE?.split(':')[0] ?? '23');
  return hours >= openingHour && hours < closingHour;
}
