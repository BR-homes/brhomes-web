import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'

export const useAuth = () => {
  const { user, token, isLoading, isAuthenticated, setUser, logout, setLoading } =
    useAuthStore()

  useEffect(() => {
    const fetchSession = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await api.get('/api/auth/me')
        if (res.data.success && res.data.data) {
          const u = res.data.data
          setUser({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            image: u.image,
            phone: u.phone,
            isProfileComplete: u.isProfileComplete,
            ownerApproved: u.ownerApproved,
          })
        } else {
          logout()
        }
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  return { user, isLoading, isAuthenticated }
}
