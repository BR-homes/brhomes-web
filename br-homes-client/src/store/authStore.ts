import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionUser {
  id: string
  name: string
  email: string
  role: 'buyer' | 'owner' | 'admin'
  image: string | null
  isProfileComplete: boolean
  ownerApproved: boolean
  phone: string | null
}

interface AuthState {
  user: SessionUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: SessionUser | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      // We don't want to persist isLoading as it should always start true/false dynamically depending on app load
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
