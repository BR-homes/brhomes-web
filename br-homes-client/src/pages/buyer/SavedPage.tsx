import { Heart } from 'lucide-react'
import PropertyGrid from '@/components/common/PropertyGrid'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { useSavedPropertiesForUser } from '@/hooks/useSaved'

export default function SavedPage() {
  const { data: saved = [], isLoading } = useSavedPropertiesForUser(true)

  const properties = Array.isArray(saved) ? saved.map((s) => s.property).filter(Boolean) : []

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Properties</h1>
          <p className="text-sm text-slate-500">{properties.length} saved</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : (
        <PropertyGrid properties={properties} emptyMessage="You haven't saved any properties yet. Browse listings and save the ones you like!" />
      )}
    </div>
  )
}
