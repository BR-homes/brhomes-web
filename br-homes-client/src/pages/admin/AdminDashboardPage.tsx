import { useQuery } from '@tanstack/react-query'
import { Users, Building2, Clock, UserCheck, Heart, BarChart3 } from 'lucide-react'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { queryKeys } from '@/lib/queryClient'
import api from '@/lib/axios'
import type { IAdminStats, IApiResponse } from '@/types'

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: async () => {
      const res = await api.get<IApiResponse<IAdminStats>>('/api/admin/stats')
      return res.data
    },
  })

  if (isLoading) return <LoadingSkeleton count={6} type="row" />

  const stats = data?.data

  const cards = [
    { label: 'Total Users', value: stats?.users.total || 0, icon: Users, color: 'bg-slate-100 text-slate-600' },
    { label: 'Buyers', value: stats?.users.buyers || 0, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Owners', value: stats?.users.owners || 0, icon: UserCheck, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Properties', value: stats?.properties.total || 0, icon: Building2, color: 'bg-slate-100 text-slate-600' },
    { label: 'Pending Approval', value: stats?.properties.pending || 0, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Live Properties', value: stats?.properties.approved || 0, icon: BarChart3, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Owners', value: stats?.pendingOwners || 0, icon: UserCheck, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Saves', value: stats?.totalSaved || 0, icon: Heart, color: 'bg-red-50 text-red-500' },
  ]

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center mb-3`}>
              <c.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
