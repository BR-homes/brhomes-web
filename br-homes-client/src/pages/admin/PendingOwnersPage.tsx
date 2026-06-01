import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserCheck, CheckCircle2, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { queryKeys } from '@/lib/queryClient'
import { formatDate } from '@/lib/utils'
import api from '@/lib/axios'
import type { IUser, IApiResponse } from '@/types'

export default function PendingOwnersPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.pendingOwners,
    queryFn: async () => {
      const res = await api.get<IApiResponse<IUser[]>>('/api/admin/owners/pending')
      return res.data
    },
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.put(`/api/admin/owners/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pendingOwners })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats })
    },
  })

  const owners = data?.data || []

  return (
    <div className="page-enter">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pending Owners</h1>
          <p className="text-sm text-slate-500">{owners.length} awaiting approval</p>
        </div>
      </div>

      {isLoading ? <LoadingSkeleton count={5} type="row" /> : owners.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No pending owner approvals</div>
      ) : (
        <div className="space-y-3">
          {owners.map((owner) => (
            <div key={owner._id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">{owner.name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{owner.email}</span>
                  {owner.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{owner.phone}</span>}
                </div>
                <p className="text-xs text-slate-400 mt-1">Registered {formatDate(owner.createdAt)}</p>
              </div>
              <Button
                onClick={() => approveMutation.mutate(owner._id)}
                disabled={approveMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 flex-shrink-0"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
