import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Trash2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { queryKeys } from '@/lib/queryClient'
import { formatPrice, getPropertyTypeLabel, getStatusColor } from '@/lib/utils'
import api from '@/lib/axios'
import type { IProperty, IApiResponse } from '@/types'

export default function ManagePropertiesPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.allProperties({ status: statusFilter, page }),
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: '12' })
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get<IApiResponse<IProperty[]>>(`/api/admin/properties?${params}`)
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/properties/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] }),
  })

  const properties = data?.data || []
  const meta = data?.meta

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">All Properties</h1>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="hidden">Hidden</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>
      </div>

      {isLoading ? <LoadingSkeleton count={6} type="row" /> : properties.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No properties found</div>
      ) : (
        <>
          <div className="space-y-3">
            {properties.map((prop) => {
              const owner = typeof prop.ownerId === 'object' ? prop.ownerId : null
              return (
                <div key={prop._id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    {prop.images[0] ? (
                      <img src={prop.images[0].imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><Building2 className="w-5 h-5" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-slate-900 text-sm truncate">{prop.title}</span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${getStatusColor(prop.status)}`}>
                        {prop.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{getPropertyTypeLabel(prop.propertyType)}</span>
                      <span>{formatPrice(prop.price)}</span>
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{prop.city}</span>
                      {owner && <span>by {owner.name}</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { if (confirm('Delete this property permanently?')) deleteMutation.mutate(prop._id) }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    aria-label="Delete property"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )
            })}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-sm text-slate-500 px-4">Page {meta.page} of {meta.totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
