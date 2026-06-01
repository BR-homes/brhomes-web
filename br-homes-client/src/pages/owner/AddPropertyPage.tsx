import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import PropertyForm from '@/components/forms/PropertyForm'
import { queryKeys } from '@/lib/queryClient'
import api from '@/lib/axios'

export default function AddPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleSubmit = async (formData: FormData) => {
    setError('')
    setIsSubmitting(true)
    try {
      await api.post('/api/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.owner.properties })
      queryClient.invalidateQueries({ queryKey: queryKeys.owner.stats })
      navigate('/owner/properties')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create property.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-enter max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Add New Property</h1>
      <p className="text-slate-500 text-sm mb-8">Your property will be reviewed by admin before going live.</p>

      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-6 border border-red-200">{error}</div>}

      <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
