import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ClipboardCheck, CheckCircle2, XCircle, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import ImageCarousel from '@/components/common/ImageCarousel'
import { queryKeys } from '@/lib/queryClient'
import { formatPrice, formatDate, getPropertyTypeLabel } from '@/lib/utils'
import api from '@/lib/axios'
import type { IProperty, IApiResponse } from '@/types'

export default function PendingPropertiesPage() {
  const queryClient = useQueryClient()
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectionNote, setRejectionNote] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.pendingProperties,
    queryFn: async () => {
      const res = await api.get<IApiResponse<IProperty[]>>('/api/admin/properties/pending')
      return res.data
    },
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.put(`/api/admin/properties/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pendingProperties })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      api.put(`/api/admin/properties/${id}/reject`, { rejectionNote: note }),
    onSuccess: () => {
      setRejectId(null)
      setRejectionNote('')
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pendingProperties })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats })
    },
  })

  const properties = data?.data || []

  let content: React.ReactNode
  if (isLoading) {
    content = <LoadingSkeleton count={4} type="row" />
  } else if (properties.length === 0) {
    content = <div className="text-center py-16 text-slate-500">No pending properties to review</div>
  } else {
    content = (
      <div className="space-y-4">
        {properties.map((prop) => {
          const owner = typeof prop.ownerId === 'object' ? prop.ownerId : null
          const images = prop.images.length > 0
            ? prop.images
            : [{ imageUrl: '/placeholder-property.jpg', cloudinaryPublicId: '', isPrimary: true }]

          return (
            <div key={prop._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Image Carousel */}
                <div className="sm:w-56 flex-shrink-0">
                  <Link to={`/properties/${prop._id}`}>
                    <ImageCarousel
                      images={images}
                      alt={prop.title}
                      className="h-48 sm:h-full w-full bg-slate-100"
                      imageClassName="rounded-t-xl sm:rounded-t-none sm:rounded-l-xl"
                      autoSlideInterval={4000}
                    />
                  </Link>
                </div>

                {/* Details */}
                <div className="flex-1 p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{getPropertyTypeLabel(prop.propertyType)}</Badge>
                    <Badge variant={prop.listingType === 'sale' ? 'success' : 'info'}>
                      {prop.listingType === 'sale' ? 'Sale' : 'Rent'}
                    </Badge>
                    <Badge variant="warning">Queue #{prop.queuePosition ?? '-'}</Badge>
                  </div>
                  <Link to={`/properties/${prop._id}`} className="hover:underline">
                    <h3 className="font-semibold text-slate-900 mb-1">{prop.title}</h3>
                  </Link>
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{prop.areaLocality}, {prop.city}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 mb-2">{formatPrice(prop.price)}</p>
                  {owner && (
                    <p className="text-xs text-slate-400">
                      by {owner.name} · requested {formatDate(prop.approvalRequestedAt || prop.createdAt)}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(prop._id)}
                      disabled={approveMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRejectId(rejectId === prop._id ? null : prop._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  </div>

                  {/* Rejection Note */}
                  {rejectId === prop._id && (
                    <div className="mt-3 flex gap-2">
                      <Input
                        placeholder="Reason for rejection (min 10 chars)..."
                        value={rejectionNote}
                        onChange={(e) => setRejectionNote(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={rejectionNote.length < 10 || rejectMutation.isPending}
                        onClick={() => rejectMutation.mutate({ id: prop._id, note: rejectionNote })}
                      >
                        Confirm
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="page-enter">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <ClipboardCheck className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pending Properties</h1>
          <p className="text-sm text-slate-500">{properties.length} awaiting review</p>
        </div>
      </div>

      {content}
    </div>
  )
}
