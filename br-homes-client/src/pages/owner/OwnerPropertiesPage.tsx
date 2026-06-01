import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PropertyGrid from '@/components/common/PropertyGrid'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { queryKeys } from '@/lib/queryClient'
import api from '@/lib/axios'
import type { IProperty, IApiResponse } from '@/types'

export default function OwnerPropertiesPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.owner.properties,
    queryFn: async () => {
      const res = await api.get<IApiResponse<IProperty[]>>('/api/owner/properties')
      return res.data
    },
  })

  const properties = data?.data || []

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Properties</h1>
        <Link to="/owner/add-property">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Property</Button>
        </Link>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : (
        <PropertyGrid properties={properties} showStatus emptyMessage="You haven't listed any properties yet." />
      )}
    </div>
  )
}
