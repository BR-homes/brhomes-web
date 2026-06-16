import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Phone, Search, Building2, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PropertyGrid from '@/components/common/PropertyGrid'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import SidebarAdSlider from '@/components/common/SidebarAdSlider'
import { useProperties } from '@/hooks/useProperties'
import { useSliderImages } from '@/hooks/useSliderImages'
import { useCategories } from '@/hooks/useCategories'
import { useFilterStore } from '@/store/filterStore'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const { data, isLoading, isError } = useProperties()
  const properties = data?.data || []
  const filters = useFilterStore()
  const { data: sliderData } = useSliderImages()
  const sliderImages = sliderData?.data || []
  const { data: catData } = useCategories()
  const categories = catData?.data || []
  const [index, setIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (sliderImages.length <= 1 || isHovered) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % sliderImages.length)
    }, 4000)
    return () => clearInterval(id)
  }, [sliderImages.length, isHovered])

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIndex((prev) => (prev + 1) % sliderImages.length)
  }

  const handleDotClick = (i: number) => {
    setIndex(i)
  }

  return (
    <div className="page-enter">
      {/* Slider Section (admin-managed) */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div 
            className="rounded-xl overflow-hidden bg-white shadow-sm relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {sliderImages.length > 0 ? (
              <div className="relative h-64 sm:h-96 w-full overflow-hidden">
                {sliderImages.map((img: any, i: number) => (
                  <img
                    key={img._id}
                    src={img.imageUrl}
                    alt={`slide-${i}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${
                      i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  />
                ))}

                {/* Left/Right Buttons */}
                {sliderImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/85 hover:bg-white backdrop-blur-sm text-slate-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none z-10"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/85 hover:bg-white backdrop-blur-sm text-slate-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none z-10"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                      {sliderImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleDotClick(i)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i === index 
                              ? 'bg-blue-600 w-6' 
                              : 'bg-white/60 hover:bg-white'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-64 sm:h-96 flex items-center justify-center text-slate-500">No slider images configured</div>
            )}
          </div>
        </div>
      </section>

      {/* Categories / In-House Services Section */}
      {categories.length > 0 && (
        <section className="py-10 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">In-House Services</h2>
              <p className="text-sm text-slate-500 mt-1">Select a category to view and call listed service providers.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat: any) => (
                <Link
                  key={cat._id}
                  to={`/categories/${cat._id}`}
                  className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-950 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center active:scale-95"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-slate-100">
                    <img 
                      src={cat.imageUrl} 
                      alt={cat.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-slate-700 text-sm group-hover:text-slate-950 leading-tight">
                    {cat.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


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

          {/* Ads Section in the Middle of Components */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SidebarAdSlider id="homepage-ad-1" layout="inline" />
              <SidebarAdSlider id="homepage-ad-2" layout="inline" />
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
