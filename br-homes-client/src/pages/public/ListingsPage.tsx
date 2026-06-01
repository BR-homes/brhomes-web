import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PropertyGrid from '@/components/common/PropertyGrid'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { useProperties } from '@/hooks/useProperties'
import { useFilterStore } from '@/store/filterStore'

export default function ListingsPage() {
  const [searchParams] = useSearchParams()
  const filters = useFilterStore()
  const { data, isLoading } = useProperties()

  // Apply URL params on mount
  useEffect(() => {
    const pt = searchParams.get('propertyType')
    if (pt && ['house', 'flat', 'shop', 'land'].includes(pt)) {
      filters.setFilter('propertyType', pt as any)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const properties = data?.data || []
  const meta = data?.meta

  const hasActiveFilters = filters.propertyType || filters.listingType || filters.bhk || filters.minPrice || filters.maxPrice || filters.search

  return (
    <div className="page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Browse Properties</h1>
          <p className="text-slate-500">
            {meta ? `${meta.total} properties found` : 'Find your perfect property in Amreli'}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filters</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={filters.resetFilters} className="ml-auto text-xs text-slate-500">
                <X className="w-3 h-3 mr-1" /> Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Search */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by title, area..."
                value={filters.search}
                onChange={(e) => filters.setFilter('search', e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Property Type */}
            <select
              value={filters.propertyType}
              onChange={(e) => filters.setFilter('propertyType', e.target.value as any)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="flat">Flat</option>
              <option value="shop">Shop</option>
              <option value="land">Land</option>
            </select>

            {/* Listing Type */}
            <select
              value={filters.listingType}
              onChange={(e) => filters.setFilter('listingType', e.target.value as any)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Sale & Rent</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>

            {/* BHK */}
            <select
              value={filters.bhk}
              onChange={(e) => filters.setFilter('bhk', e.target.value as any)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Any BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
              <option value="5">5 BHK</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => filters.setFilter('sort', e.target.value as any)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="flex gap-3 mt-3">
            <Input
              type="number"
              placeholder="Min Price (₹)"
              value={filters.minPrice}
              onChange={(e) => filters.setFilter('minPrice', e.target.value)}
              className="max-w-[180px]"
            />
            <Input
              type="number"
              placeholder="Max Price (₹)"
              value={filters.maxPrice}
              onChange={(e) => filters.setFilter('maxPrice', e.target.value)}
              className="max-w-[180px]"
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSkeleton count={6} />
        ) : (
          <>
            <PropertyGrid properties={properties} emptyMessage="No properties match your filters. Try adjusting your search." />

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page <= 1}
                  onClick={() => filters.setFilter('page', filters.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-500 px-4">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page >= meta.totalPages}
                  onClick={() => filters.setFilter('page', filters.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
