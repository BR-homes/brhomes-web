import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { queryKeys } from '@/lib/queryClient'
import { useFilterStore } from '@/store/filterStore'
import type { IProperty, IApiResponse } from '@/types'

export const useProperties = () => {
  const filters = useFilterStore()

  const queryParams = {
    ...(filters.city && { city: filters.city }),
    ...(filters.propertyType && { propertyType: filters.propertyType }),
    ...(filters.listingType && { listingType: filters.listingType }),
    ...(filters.bhk && { bhk: filters.bhk }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    ...(filters.search && { search: filters.search }),
    sort: filters.sort,
    page: filters.page.toString(),
    limit: '12',
  }

  return useQuery({
    queryKey: queryKeys.properties.list(queryParams),
    queryFn: async () => {
      const params = new URLSearchParams(queryParams)
      const res = await api.get<IApiResponse<IProperty[]>>(
        `/api/properties?${params.toString()}`
      )
      return res.data
    },
  })
}

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: async () => {
      const res = await api.get<IApiResponse<IProperty>>(`/api/properties/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: async () => {
      const res = await api.get<IApiResponse<IProperty[]>>(
        '/api/properties?limit=6&sort=newest'
      )
      return res.data
    },
  })
}
