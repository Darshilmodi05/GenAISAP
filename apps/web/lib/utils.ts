import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names safely with Tailwind CSS
 * Combines clsx for dynamic classes and twMerge for Tailwind specificity
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
