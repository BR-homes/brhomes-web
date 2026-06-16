import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { IApiResponse } from '@/types'
import { toast } from 'react-hot-toast'

export const useCategories = (isAdmin = false) => {
  return useQuery({
    queryKey: ['categories', isAdmin ? 'admin' : 'public'],
    queryFn: async () => {
      const endpoint = isAdmin ? '/api/categories/admin' : '/api/categories'
      const res = await api.get<IApiResponse<any[]>>(endpoint)
      return res.data
    },
  })
}

export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post<IApiResponse<any>>('/api/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created successfully')
    },
  })
}

export const useUpdateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await api.put<IApiResponse<any>>(`/api/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated successfully')
    },
  })
}

export const useToggleCategoryActive = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<IApiResponse<any>>(`/api/categories/${id}/toggle`)
      return res.data
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success(data.message || 'Category status updated')
    },
  })
}

export const useDeleteCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<IApiResponse<null>>(`/api/categories/${id}`)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['services'] }) // services under category are also deleted
      toast.success('Category deleted successfully')
    },
  })
}
