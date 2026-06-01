import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LoadingSkeleton from './LoadingSkeleton'

interface ProtectedRouteProps {
  allowedRoles?: ('buyer' | 'owner' | 'admin')[]
  requireApproved?: boolean
}

export default function ProtectedRoute({ allowedRoles, requireApproved = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSkeleton count={3} />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (!user.isProfileComplete) {
    return <Navigate to="/complete-profile" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  if (requireApproved && user.role === 'owner' && !user.ownerApproved) {
    return <Navigate to="/owner/pending" replace />
  }

  return <Outlet />
}
