import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price in Indian Rupee format (₹1,23,456)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return 'N/A'
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  } catch (error) {
    return 'N/A'
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Get status badge color classes
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    hidden: 'bg-slate-100 text-slate-600 border-slate-200',
    sold: 'bg-blue-50 text-blue-700 border-blue-200',
    rented: 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return colors[status] || 'bg-slate-100 text-slate-600 border-slate-200'
}

/**
 * Get property type label
 */
export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    house: 'House',
    flat: 'Flat',
    shop: 'Shop',
    land: 'Land',
  }
  return labels[type] || type
}
