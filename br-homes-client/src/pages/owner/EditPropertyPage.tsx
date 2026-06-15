import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import PropertyForm from '@/components/forms/PropertyForm'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { useProperty } from '@/hooks/useProperties'
import { queryKeys } from '@/lib/queryClient'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useProperty(id!)
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  if (isLoading) return <LoadingSkeleton type="detail" />
  if (!data?.data) return <p className="text-center py-10 text-slate-500">Property not found.</p>

  const handleSubmit = async (formData: FormData) => {
    setError('')
    setIsSubmitting(true)
    try {
      await api.put(`/api/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.owner.properties })
        queryClient.invalidateQueries({ queryKey: queryKeys.owner.stats })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(id!) })
      navigate(isAdmin ? '/admin/properties' : '/owner/properties')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update property.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-enter max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit Property</h1>
      <p className="text-slate-500 text-sm mb-8">
        {isAdmin
          ? 'Modify the property listing details.'
          : 'Changes will be re-submitted for review.'}
      </p>
      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-6 border border-red-200">{error}</div>}
      <PropertyForm initialData={data.data} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
