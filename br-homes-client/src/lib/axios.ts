import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
})

// Request interceptor to inject Authorization header
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.data?.error?.code

    if (code === 'AUTH_REQUIRED') {
      useAuthStore.getState().logout()
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
