import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { ISavedProperty } from '@/types'
import { queryKeys } from '@/lib/queryClient'

export function useSavedPropertiesForUser(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.saved.all,
    enabled,
    queryFn: async () => {
      const { data } = await api.get('/api/saved')
      return data.data as ISavedProperty[]
    },
  })
}

export function useSaveProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { data } = await api.post(`/api/saved/${propertyId}`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.saved.all })
    }
  })
}

export function useUnsaveProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { data } = await api.delete(`/api/saved/${propertyId}`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.saved.all })
    }
  })
}
