import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'

const schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  role: z.enum(['buyer', 'owner']),
})
type FormData = z.infer<typeof schema>

export default function CompleteProfilePage() {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { setUser, user } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'buyer' },
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    setIsSubmitting(true)
    try {
      const res = await api.post('/api/auth/complete-profile', data)
      if (res.data.success) {
        const { token, user: u } = res.data.data
        const { setToken } = useAuthStore.getState()
        setToken(token)
        setUser({ ...user!, phone: u.phone, role: u.role, isProfileComplete: true, ownerApproved: u.ownerApproved })
        if (u.role === 'owner' && !u.ownerApproved) navigate('/owner/pending')
        else navigate('/properties')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Complete Your Profile</h2>
      <p className="text-sm text-slate-500 mb-6">Set your phone number and role to continue</p>

      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4 border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="cp-phone">Phone Number *</Label>
          <Input id="cp-phone" placeholder="9876543210" {...register('phone')} className="mt-1" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label>I want to *</Label>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <label className="relative">
              <input type="radio" value="buyer" {...register('role')} className="peer sr-only" />
              <div className="p-3 rounded-lg border-2 border-slate-200 text-center cursor-pointer transition-all peer-checked:border-slate-900 peer-checked:bg-slate-50">
                <span className="text-sm font-medium">Buy / Rent</span>
              </div>
            </label>
            <label className="relative">
              <input type="radio" value="owner" {...register('role')} className="peer sr-only" />
              <div className="p-3 rounded-lg border-2 border-slate-200 text-center cursor-pointer transition-all peer-checked:border-slate-900 peer-checked:bg-slate-50">
                <span className="text-sm font-medium">List Property</span>
              </div>
            </label>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Continue
        </Button>
      </form>
    </div>
  )
}
