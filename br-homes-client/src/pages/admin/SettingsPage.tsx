import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, Save, Loader2, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { queryKeys } from '@/lib/queryClient'
import api from '@/lib/axios'
import type { ISetting, IApiResponse } from '@/types'

export default function SettingsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.settings,
    queryFn: async () => {
      const res = await api.get<IApiResponse<ISetting[]>>('/api/admin/settings')
      return res.data
    },
  })

  const globalLimit = data?.data?.find((s) => s.key === 'globalImageLimit')
  const [newLimit, setNewLimit] = useState('')

  const updateMutation = useMutation({
    mutationFn: (limit: number) => api.put('/api/admin/settings/image-limit', { globalImageLimit: limit }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings })
      setNewLimit('')
    },
  })

  if (isLoading) return <LoadingSkeleton count={3} type="row" />

  const currentLimit = (globalLimit?.value as number) ?? 7

  return (
    <div className="page-enter">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Settings className="w-5 h-5 text-slate-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
      </div>

      <div className="max-w-lg">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Image Upload Limit</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Maximum number of images an owner can upload per property. Current limit:{' '}
            <span className="font-bold text-slate-900">{currentLimit}</span>
          </p>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="img-limit" className="sr-only">New Limit</Label>
              <Input
                id="img-limit"
                type="number"
                min={1}
                max={20}
                placeholder={`Current: ${currentLimit}`}
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
              />
              {newLimit && (parseInt(newLimit) < 1 || parseInt(newLimit) > 20) && (
                <p className="text-red-500 text-xs mt-1">Image limit must be between 1 and 20</p>
              )}
            </div>
            <Button
              onClick={() => updateMutation.mutate(parseInt(newLimit))}
              disabled={!newLimit || parseInt(newLimit) < 1 || parseInt(newLimit) > 20 || updateMutation.isPending}
              className="self-start"
            >
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </div>

          {updateMutation.isSuccess && (
            <p className="text-emerald-600 text-sm mt-3">✓ Image limit updated successfully</p>
          )}
        </div>
      </div>
    </div>
  )
}
