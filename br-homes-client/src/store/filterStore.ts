import { create } from 'zustand'

interface FilterState {
  city: string
  propertyType: '' | 'house' | 'flat'
  listingType: '' | 'sale' | 'rent'
  bhk: '' | '1' | '2' | '3' | '4' | '5'
  minPrice: string
  maxPrice: string
  sort: 'newest' | 'price_asc' | 'price_desc'
  search: string
  page: number
  setFilter: <K extends keyof Omit<FilterState, 'setFilter' | 'resetFilters'>>(
    key: K,
    value: FilterState[K]
  ) => void
  resetFilters: () => void
}

const defaultFilters = {
  city: '',
  propertyType: '' as const,
  listingType: '' as const,
  bhk: '' as const,
  minPrice: '',
  maxPrice: '',
  sort: 'newest' as const,
  search: '',
  page: 1,
}

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
      ...(key !== 'page' ? { page: 1 } : {}),
    })),
  resetFilters: () => set(defaultFilters),
}))
