import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Building2, Clock, CheckCircle2, XCircle, EyeOff, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { queryKeys } from '@/lib/queryClient'
import api from '@/lib/axios'
import type { IOwnerStats, IApiResponse } from '@/types'

export default function OwnerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.owner.stats,
    queryFn: async () => {
      const res = await api.get<IApiResponse<IOwnerStats>>('/api/owner/stats')
      return res.data
    },
  })

  const stats = data?.data

  if (isLoading) return <LoadingSkeleton count={4} type="row" />

  const statCards = [
    { label: 'Total', value: stats?.total || 0, icon: Building2, color: 'bg-slate-100 text-slate-600' },
    { label: 'Approved', value: stats?.approved || 0, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Rejected', value: stats?.rejected || 0, icon: XCircle, color: 'bg-red-50 text-red-600' },
    { label: 'Hidden', value: stats?.hidden || 0, icon: EyeOff, color: 'bg-slate-100 text-slate-500' },
    { label: 'Sold/Rented', value: (stats?.sold || 0) + (stats?.rented || 0), icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
  ]

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <Link to="/owner/add-property">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Property</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-sm text-slate-600">
          <span className="font-medium">Image Limit:</span> You can upload up to{' '}
          <span className="font-bold text-slate-900">{stats?.effectiveImageLimit || 7}</span>{' '}
          images per property.
        </p>
      </div>
    </div>
  )
}
