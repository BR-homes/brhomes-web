import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Database or network error occurred.'
      toast.error(`Database/API Error: ${message}`, { id: 'api-query-error' })
    }
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Action failed.'
      toast.error(`Operation Failed: ${message}`, { id: 'api-mutation-error' })
    }
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export const queryKeys = {
  properties: {
    all: ['properties'] as const,
    list: (filters: Record<string, unknown>) => ['properties', 'list', filters] as const,
    detail: (id: string) => ['properties', 'detail', id] as const,
  },
  owner: {
    properties: ['owner', 'properties'] as const,
    stats: ['owner', 'stats'] as const,
  },
  saved: {
    all: ['saved'] as const,
  },
  admin: {
    stats: ['admin', 'stats'] as const,
    pendingOwners: ['admin', 'owners', 'pending'] as const,
    pendingProperties: ['admin', 'properties', 'pending'] as const,
    allProperties: (f: Record<string, unknown>) => ['admin', 'properties', f] as const,
    allUsers: (f: Record<string, unknown>) => ['admin', 'users', f] as const,
    settings: ['admin', 'settings'] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },
}
