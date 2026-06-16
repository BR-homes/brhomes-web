import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { IApiResponse } from '@/types'
import { toast } from 'react-hot-toast'

export const useServices = (categoryId?: string, isAdmin = false) => {
  return useQuery({
    queryKey: ['services', categoryId || 'all', isAdmin ? 'admin' : 'public'],
    queryFn: async () => {
      const baseUrl = isAdmin ? '/api/services/admin' : '/api/services'
      const params = new URLSearchParams()
      if (categoryId) {
        params.append('categoryId', categoryId)
      }
      const res = await api.get<IApiResponse<any[]>>(`${baseUrl}?${params.toString()}`)
      return res.data
    },
  })
}

export const useCreateService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { title: string; description: string; contactPhone: string; categoryId: string }) => {
      const res = await api.post<IApiResponse<any>>('/api/services', payload)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service created successfully')
    },
  })
}

export const useUpdateService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { title: string; description: string; contactPhone: string; categoryId: string } }) => {
      const res = await api.put<IApiResponse<any>>(`/api/services/${id}`, payload)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service updated successfully')
    },
  })
}

export const useToggleServiceActive = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<IApiResponse<any>>(`/api/services/${id}/toggle`)
      return res.data
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['services'] })
      toast.success(data.message || 'Service status updated')
    },
  })
}

export const useDeleteService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<IApiResponse<null>>(`/api/services/${id}`)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service deleted successfully')
    },
  })
}
