import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { IApiResponse } from '@/types'

export const useSliderImages = () => {
  return useQuery({
    queryKey: ['slider', 'images'],
    queryFn: async () => {
      const res = await api.get<IApiResponse<any[]>>('/api/sliders')
      return res.data
    },
  })
}
