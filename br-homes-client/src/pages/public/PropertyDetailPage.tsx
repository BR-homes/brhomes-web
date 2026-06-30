import { useParams } from 'react-router-dom'
import { MapPin, Phone, BedDouble, Maximize2, IndianRupee, Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { useProperty } from '@/hooks/useProperties'
import { useUIStore } from '@/store/uiStore'
import { formatPrice, formatDate, getPropertyTypeLabel } from '@/lib/utils'
import { useState, useEffect, useCallback } from 'react'
import SavePropertyButton from '@/components/common/SavePropertyButton'
import SharePropertyButton from '@/components/common/SharePropertyButton'
import SidebarAdSlider from '@/components/common/SidebarAdSlider'

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useProperty(id!)
  const { openImageDialog, isImageDialogOpen, selectedImageIndex, closeImageDialog } = useUIStore()
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const property = data?.data
  const images = property?.images && property.images.length > 0
    ? property.images
    : [{ imageUrl: '/placeholder-property.jpg', cloudinaryPublicId: '', isPrimary: true }]

  const goNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1 || isHovered) return
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000) // Auto slide every 4 seconds
    return () => clearInterval(interval)
  }, [images.length, isHovered])

  useEffect(() => {
    if (property) {
      document.title = `${property.title} | BR-Homes`
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', `${property.title} in ${property.areaLocality}, ${property.city}. ${property.description.substring(0, 150)}...`)
      }
    }
    return () => {
      document.title = 'BR-Homes | No-Broker Property in Amreli'
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 'BR-Homes - No-broker real estate marketplace for Amreli, Gujarat. Browse houses and flats directly from owners. Zero commission.')
      }
    }
  }, [property])

  if (isLoading) return <LoadingSkeleton type="detail" />

  if (isError || !data?.data || !property) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Not Found</h2>
        <p className="text-slate-500">This property may have been removed or is not available.</p>
      </div>
    )
  }

  const owner = typeof property.ownerId === 'object' ? property.ownerId : null

  return (
    <div className="page-enter max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[6.8fr_3.2fr] lg:grid-cols-[7.2fr_2.8fr] gap-8">
        {/* Details */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <div 
            className="relative rounded-2xl overflow-hidden bg-slate-100 mb-8 group/gallery"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              className="aspect-video relative cursor-pointer overflow-hidden" 
              onClick={() => openImageDialog(currentImage)}
            >
              {/* Sliding Track */}
              <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.imageUrl}
                    alt={`${property.title} - ${i + 1}`}
                    className="w-full h-full object-cover flex-shrink-0"
                  />
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover/gallery:opacity-100 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover/gallery:opacity-100 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full z-10">
                    {currentImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      i === currentImage ? 'border-slate-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nested Grid: Left Column is Details, Right Column is Contact Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="capitalize">{getPropertyTypeLabel(property.propertyType)}</Badge>
                  <Badge variant={property.listingType === 'sale' ? 'success' : 'info'}>
                    For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
                  </Badge>
                  {property.status !== 'approved' && (
                    <Badge variant="warning" className="capitalize">{property.status}</Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span>{property.areaLocality}, {property.city} - {property.pincode}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <IndianRupee className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <p className="text-lg font-bold text-slate-900">{formatPrice(property.price)}</p>
                  <p className="text-xs text-slate-500">{property.listingType === 'rent' ? '/month' : 'Price'}</p>
                </div>
                {property.bhk && (
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <BedDouble className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <p className="text-lg font-bold text-slate-900">{property.bhk} BHK</p>
                    <p className="text-xs text-slate-500">Bedrooms</p>
                  </div>
                )}
                {property.areaSqft && (
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <Maximize2 className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <p className="text-lg font-bold text-slate-900">{property.areaSqft.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">sq.ft</p>
                  </div>
                )}
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <p className="text-lg font-bold text-slate-900">{formatDate(property.createdAt)}</p>
                  <p className="text-xs text-slate-500">Listed</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Mobile Ad Slider (Visible only on mobile screens) */}
              <div className="block md:hidden">
                <SidebarAdSlider id="mobile-detail-ad-1" layout="inline" />
              </div>
            </div>

            {/* Contact Card (Nested inside left details panel) */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Owner</h3>
                {(property.customOwnerName || owner) && (
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{property.customOwnerName || owner?.name}</p>
                      <p className="text-sm text-slate-500">Property Owner</p>
                    </div>
                  </div>
                )}
                <a
                  href={`tel:+91${property.contactPhone}`}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-base transition-colors shadow-sm shadow-emerald-200"
                >
                  <Phone className="w-5 h-5" />
                  +91 {property.contactPhone}
                </a>
                <p className="text-xs text-slate-400 text-center mt-3 mb-6">
                  Call the owner directly - no broker involved
                </p>
                <div className="flex flex-col gap-3">
                  <SavePropertyButton propertyId={property._id} variant="full" />
                  <SharePropertyButton property={property} variant="full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Advertisement Videos (Muted Autoplay sequential) */}
        <div className="hidden md:block">
          <div className="sticky top-24 space-y-4 w-full">
            <SidebarAdSlider id="sidebar-ad-1" layout="sidebar" />
            <SidebarAdSlider id="sidebar-ad-2" layout="sidebar" />
          </div>
        </div>
      </div>

      {/* Fullscreen Image Dialog */}
      {isImageDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeImageDialog}>
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                const prevIndex = (selectedImageIndex - 1 + images.length) % images.length
                openImageDialog(prevIndex)
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={images[selectedImageIndex].imageUrl}
            alt=""
            className="max-w-[85vw] max-h-[85vh] object-contain select-none transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                const nextIndex = (selectedImageIndex + 1) % images.length
                openImageDialog(nextIndex)
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <button
            onClick={closeImageDialog}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-1.5 rounded-full select-none">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}
