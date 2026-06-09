import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { IApiResponse, ISidebarAd } from '@/types'

export const useSidebarAds = () => {
  return useQuery({
    queryKey: ['sidebar', 'ads'],
    queryFn: async () => {
      const res = await api.get<IApiResponse<ISidebarAd[]>>('/api/sidebar-ads')
      return res.data
    },
  })
}
