import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Phone, Search, Building2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PropertyGrid from '@/components/common/PropertyGrid'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { useProperties } from '@/hooks/useProperties'
import { useSliderImages } from '@/hooks/useSliderImages'
import { useFilterStore } from '@/store/filterStore'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const { data, isLoading } = useProperties()
  const properties = data?.data || []
  const filters = useFilterStore()
  const { data: sliderData } = useSliderImages()
  const sliderImages = sliderData?.data || []
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (sliderImages.length ? (i + 1) % sliderImages.length : 0)), 4000)
    return () => clearInterval(id)
  }, [sliderImages.length])

  return (
    <div className="page-enter">
      {/* Slider Section (admin-managed) */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-xl overflow-hidden bg-white shadow-sm">
            {sliderImages.length > 0 ? (
              <div className="relative h-64 sm:h-96">
                {sliderImages.map((img: any, i: number) => (
                  <img
                    key={img._id}
                    src={img.imageUrl}
                    alt={`slide-${i}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
              </div>
            ) : (
              <div className="h-64 sm:h-96 flex items-center justify-center text-slate-500">No slider images configured</div>
            )}
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Home, label: 'Houses', type: 'house', color: 'bg-blue-50 text-blue-600' },
              { icon: Building2, label: 'Flats', type: 'flat', color: 'bg-purple-50 text-purple-600' },
            ].map((item) => (
              <Link
                key={item.type}
                to={`/properties?propertyType=${item.type}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Search + Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                placeholder="Search by city, area or keywords"
                value={filters.search}
                onChange={(e) => useFilterStore.getState().setFilter('search', e.target.value)}
                className="col-span-2 p-3 border rounded-lg"
              />
              <select
                value={filters.propertyType}
                onChange={(e) => useFilterStore.getState().setFilter('propertyType', e.target.value as any)}
                className="p-3 border rounded-lg"
              >
                <option value="">All types</option>
                <option value="house">House</option>
                <option value="flat">Flat</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Search Results</h2>
              <p className="text-slate-500">Matching properties</p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="hidden sm:flex">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : (
            <PropertyGrid properties={properties} emptyMessage="No properties found." />
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/properties">
              <Button variant="outline" className="w-full">
                View All Properties <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Phone className="w-10 h-10 mx-auto mb-4 text-slate-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Own a Property?</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            List it for free and connect directly with buyers. No broker fees, ever.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold">
              Start Listing Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
