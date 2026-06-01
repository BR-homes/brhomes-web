import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
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
