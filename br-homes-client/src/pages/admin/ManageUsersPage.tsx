import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, UserX, UserCheck, Mail, Phone, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { queryKeys } from '@/lib/queryClient'
import { formatDate } from '@/lib/utils'
import api from '@/lib/axios'
import type { IUser, IApiResponse } from '@/types'

export default function ManageUsersPage() {
  const queryClient = useQueryClient()
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.allUsers({ role: roleFilter, search, page }),
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: '20' })
      if (roleFilter) params.set('role', roleFilter)
      if (search) params.set('search', search)
      const res = await api.get<IApiResponse<IUser[]>>(`/api/admin/users?${params}`)
      return res.data
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/admin/users/${id}/deactivate`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const users = data?.data || []
  const meta = data?.meta

  const roleColor: Record<string, string> = {
    buyer: 'bg-blue-50 text-blue-700',
    owner: 'bg-purple-50 text-purple-700',
    admin: 'bg-slate-900 text-white',
  }

  return (
    <div className="page-enter">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Users className="w-5 h-5 text-slate-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All Roles</option>
          <option value="buyer">Buyers</option>
          <option value="owner">Owners</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {isLoading ? <LoadingSkeleton count={8} type="row" /> : users.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No users found</div>
      ) : (
        <>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user._id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900 text-sm">{user.name}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${roleColor[user.role] || ''}`}>
                      {user.role}
                    </span>
                    {!user.isActive && (
                      <Badge variant="error" className="text-[10px]">Deactivated</Badge>
                    )}
                    {user.role === 'owner' && user.ownerApproved && (
                      <Badge variant="success" className="text-[10px]">Approved</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</span>
                    {user.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{user.phone}</span>}
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
                {user.role !== 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActiveMutation.mutate(user._id)}
                    disabled={toggleActiveMutation.isPending}
                    className={user.isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}
                  >
                    {user.isActive ? <><UserX className="w-3.5 h-3.5 mr-1" /> Deactivate</> : <><UserCheck className="w-3.5 h-3.5 mr-1" /> Activate</>}
                  </Button>
                )}
              </div>
            ))}
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
