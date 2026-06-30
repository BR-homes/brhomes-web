import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { useServices } from '@/hooks/useServices'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Phone, ChevronLeft, Wrench, AlertCircle } from 'lucide-react'

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>()

  // Fetch all active categories to find the current one's title
  const { data: catData, isLoading: isLoadingCats } = useCategories(false)
  const currentCategory = catData?.data?.find((c: any) => c._id === id)

  // Fetch all active services for this category
  const { data: servData, isLoading: isLoadingServs } = useServices(id, false)
  const services = servData?.data || []

  const isLoading = isLoadingCats || isLoadingServs

  useEffect(() => {
    if (currentCategory) {
      document.title = `${currentCategory.title} Services | BR-Homes`
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', `Professional in-house ${currentCategory.title} services in Amreli. Find reliable local service providers with zero commission.`)
      }
    }
    return () => {
      document.title = 'BR-Homes | No-Broker Property in Amreli'
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 'BR-Homes - No-broker real estate marketplace for Amreli, Gujarat. Browse houses and flats directly from owners. Zero commission.')
      }
    }
  }, [currentCategory])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSkeleton count={6} />
      </div>
    )
  }

  if (!currentCategory) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Category Not Found</h2>
        <p className="text-slate-500 mb-6">The service category you are looking for does not exist or has been hidden.</p>
        <Link to="/">
          <Button>Back to Homepage</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="page-enter bg-slate-50 min-h-[calc(100vh-4rem-1px)]">
      {/* Category Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-4 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {currentCategory.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                <span>In-House Services</span>
                <span>•</span>
                <span>{services.length} available service{services.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            {currentCategory.imageUrl && (
              <img 
                src={currentCategory.imageUrl} 
                alt={currentCategory.title} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {services.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto shadow-sm">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg mb-1">No Services Offered Yet</h3>
            <p className="text-slate-500 text-sm">
              We are currently setting up services in this category. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service: any) => (
              <div 
                key={service._id} 
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 hover:-translate-y-0.5"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                    {service.description}
                  </p>
                </div>

                <a 
                  href={`tel:${service.contactPhone.replace(/\s+/g, '')}`}
                  className="block w-full"
                >
                  <Button 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-2.5 h-11 rounded-xl shadow-sm transition-all duration-300 active:scale-95"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    Call Service Provider ({service.contactPhone})
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
