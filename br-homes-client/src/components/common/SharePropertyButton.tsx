import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { IProperty } from '@/types'

interface SharePropertyButtonProps {
  property: IProperty
  className?: string
  variant?: 'icon' | 'full'
}

export default function SharePropertyButton({ property, className = '', variant = 'icon' }: Readonly<SharePropertyButtonProps>) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const address = `${property.areaLocality}, ${property.city}, ${property.pincode}`
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    const propertyUrl = `${window.location.origin}/properties/${property._id}`

    const shareTitle = `Property in ${property.city} - BR-Homes`
    const shareMessage = `Check out this property on BR-Homes:\n🏡 *${property.title}*\n📍 *Address:* ${property.areaLocality}, ${property.city} - ${property.pincode}\n🗺️ *Google Maps:* ${googleMapsUrl}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: propertyUrl,
        })
        toast.success('Shared successfully!')
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      // Fallback: Copy to clipboard
      const fullCopyText = `${shareMessage}\n🔗 *View Details:* ${propertyUrl}`
      try {
        await navigator.clipboard.writeText(fullCopyText)
        toast.success('Property details & location link copied to clipboard!')
      } catch (err) {
        toast.error('Failed to copy to clipboard')
      }
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-sm bg-white/80 text-slate-500 border border-slate-200/50 hover:bg-white hover:text-slate-700 ${className}`}
        aria-label="Share property"
        type="button"
      >
        <Share2 className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
      </button>
    )
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 ${className}`}
      type="button"
    >
      <Share2 className="w-4 h-4" />
      Share Property
    </Button>
  )
}
