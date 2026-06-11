import { Outlet, Navigate, useLocation, Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function AuthLayout() {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const location = useLocation()

  // Redirect authenticated users away from login/register pages
  if (!isLoading && isAuthenticated && user) {
    if (!user.isProfileComplete) {
      if (location.pathname !== '/complete-profile') return <Navigate to="/complete-profile" replace />
    } else if (user.role === 'admin') {
      if (location.pathname !== '/admin/dashboard') return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === 'owner') {
      const target = user.ownerApproved ? '/owner/dashboard' : '/owner/pending'
      if (location.pathname !== target) return <Navigate to={target} replace />
    } else {
      if (location.pathname !== '/properties') return <Navigate to="/properties" replace />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src="/logo.jpg" alt="BR-Homes Logo" className="h-12" />
        </Link>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <Outlet />
        </div>

        <p className="text-center mt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} BR-Homes - No broker, no commission
        </p>
      </div>
    </div>
  )
}
