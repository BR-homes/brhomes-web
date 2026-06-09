import { Heart } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useSavedProperties, useSaveProperty, useUnsaveProperty } from '@/hooks/useSaved'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

interface SavePropertyButtonProps {
  propertyId: string
  className?: string
  variant?: 'icon' | 'full'
}

export default function SavePropertyButton({ propertyId, className = '', variant = 'icon' }: SavePropertyButtonProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { data: savedProperties = [] } = useSavedProperties()
  const { mutate: saveProperty, isPending: isSaving } = useSaveProperty()
  const { mutate: unsaveProperty, isPending: isUnsaving } = useUnsaveProperty()

  const isSaved = Array.isArray(savedProperties) && savedProperties.some((s) => s.property?._id === propertyId || (s.property as any) === propertyId)
  const isLoading = isSaving || isUnsaving

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating if it's inside a Link
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error('Please login to save properties')
      return
    }

    if (isSaved) {
      unsaveProperty(propertyId, {
        onSuccess: () => toast.success('Property removed from saved'),
        onError: () => toast.error('Failed to unsave property'),
      })
    } else {
      saveProperty(propertyId, {
        onSuccess: () => toast.success('Property saved'),
        onError: () => toast.error('Failed to save property'),
      })
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-sm ${
          isSaved
            ? 'bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100'
            : 'bg-white/80 text-slate-500 border border-slate-200/50 hover:bg-white hover:text-slate-700'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        aria-label={isSaved ? 'Unsave property' : 'Save property'}
      >
        <Heart className={`w-5 h-5 transition-transform duration-300 ${isSaved ? 'fill-current scale-110' : 'scale-100 hover:scale-110'}`} />
      </button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 ${
        isSaved 
          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700' 
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
      } ${className}`}
    >
      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      {isSaved ? 'Saved' : 'Save Property'}
    </Button>
  )
}
