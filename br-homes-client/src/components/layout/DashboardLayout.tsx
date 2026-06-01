import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard, Building2, Plus, Users, ClipboardCheck,
  Settings, Shield, UserCheck, BarChart3
} from 'lucide-react'

export default function DashboardLayout() {
  const { user } = useAuthStore()

  const ownerLinks = [
    { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/owner/properties', label: 'My Properties', icon: Building2 },
    { to: '/owner/add-property', label: 'Add Property', icon: Plus },
  ]

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { to: '/admin/pending-owners', label: 'Pending Owners', icon: UserCheck },
    { to: '/admin/pending-properties', label: 'Pending Properties', icon: ClipboardCheck },
    { to: '/admin/properties', label: 'All Properties', icon: Building2 },
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const links = user?.role === 'admin' ? adminLinks : ownerLinks

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-60 flex-shrink-0">
          <nav className="lg:sticky lg:top-24 bg-white rounded-xl border border-slate-200 p-2 space-y-0.5">
            <div className="px-3 py-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-900 capitalize">
                  {user?.role} Panel
                </span>
              </div>
            </div>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
