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
  const { data, isLoading, isError } = useProperties()

  // Apply URL params on mount
  useEffect(() => {
    const pt = searchParams.get('propertyType')
    if (pt && ['house', 'flat'].includes(pt)) {
      filters.setFilter('propertyType', pt as any)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let title = 'Browse Properties | BR-Homes'
    let description = 'Find your perfect property in Amreli, Gujarat. Browse no-broker houses, flats, and shops directly from owners with zero commission.'

    if (filters.propertyType || filters.listingType) {
      const type = filters.propertyType ? `${filters.propertyType}s` : 'Properties'
      const listing = filters.listingType ? `for ${filters.listingType}` : ''
      title = `Browse ${type} ${listing} | BR-Homes`
      description = `Browse the latest ${type} ${listing} in Amreli, Gujarat. Direct from owner, zero brokerage fee.`
    }

    document.title = title
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    return () => {
      document.title = 'BR-Homes | No-Broker Property in Amreli'
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 'BR-Homes - No-broker real estate marketplace for Amreli, Gujarat. Browse houses and flats directly from owners. Zero commission.')
      }
    }
  }, [filters.propertyType, filters.listingType])

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
              {/* only house/flat supported */}
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
              onChange={(e) => {
                const val = e.target.value
                if (val === '' || Number(val) >= 0) {
                  filters.setFilter('minPrice', val)
                }
              }}
              onWheel={(e) => e.currentTarget.blur()}
              className="max-w-[180px]"
            />
            <Input
              type="number"
              placeholder="Max Price (₹)"
              value={filters.maxPrice}
              onChange={(e) => {
                const val = e.target.value
                if (val === '' || Number(val) >= 0) {
                  filters.setFilter('maxPrice', val)
                }
              }}
              onWheel={(e) => e.currentTarget.blur()}
              className="max-w-[180px]"
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSkeleton count={6} />
        ) : isError ? (
          <div className="text-center py-16 px-4 bg-rose-50/50 rounded-2xl border border-rose-100 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-bold text-rose-950 text-base mb-1">Failed to load properties</h3>
            <p className="text-rose-600 text-sm">Unable to connect to the database. Please try again later.</p>
          </div>
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
