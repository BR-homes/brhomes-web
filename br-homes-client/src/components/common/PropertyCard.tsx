import { Link } from 'react-router-dom'
import { MapPin, IndianRupee, BedDouble, Maximize2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getPropertyTypeLabel } from '@/lib/utils'
import type { IProperty, PropertyStatus } from '@/types'
import SavePropertyButton from '@/components/common/SavePropertyButton'
import SharePropertyButton from '@/components/common/SharePropertyButton'
import ImageCarousel from '@/components/common/ImageCarousel'

interface PropertyCardProps {
  property: IProperty
  showStatus?: boolean
}

const statusVariant: Record<PropertyStatus, 'success' | 'warning' | 'error' | 'secondary' | 'info'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  hidden: 'secondary',
  sold: 'info',
  rented: 'info',
}

export default function PropertyCard({ property, showStatus = false }: PropertyCardProps) {
  const images = property.images.length > 0
    ? property.images
    : [{ imageUrl: '/placeholder-property.jpg', cloudinaryPublicId: '', isPrimary: true }]

  return (
    <Link to={`/properties/${property._id}`} className="group block">
      <article className="bg-white rounded-xl border border-slate-200/80 overflow-hidden hover-lift">
        {/* Image Carousel */}
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          <ImageCarousel
            images={images}
            alt={property.title}
            className="h-full w-full"
            autoSlideInterval={3000}
          />

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex gap-1.5 z-20">
            <Badge variant="default" className="bg-white/90 text-slate-900 backdrop-blur-sm text-xs shadow-sm">
              {getPropertyTypeLabel(property.propertyType)}
            </Badge>
            <Badge
              variant="default"
              className={`backdrop-blur-sm text-xs shadow-sm ${
                property.listingType === 'sale'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-blue-500/90 text-white'
              }`}
            >
              For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
            </Badge>
          </div>
          
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-20">
            {showStatus && (
              <Badge variant={statusVariant[property.status]} className="capitalize text-xs">
                {property.status}
              </Badge>
            )}
            {!showStatus && (
              <div className="flex flex-col gap-2">
                <SavePropertyButton propertyId={property._id} />
                <SharePropertyButton property={property} />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-900 text-base mb-1 line-clamp-1 group-hover:text-slate-700 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{property.areaLocality}, {property.city}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            {property.bhk && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                {property.bhk} BHK
              </span>
            )}
            {property.areaSqft && (
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" />
                {property.areaSqft.toLocaleString()} sq.ft
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
            <IndianRupee className="w-4 h-4 text-slate-900" />
            <span className="text-lg font-bold text-slate-900">
              {formatPrice(property.price).replace('₹', '')}
            </span>
            {property.listingType === 'rent' && (
              <span className="text-xs text-slate-500 ml-1">/month</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
