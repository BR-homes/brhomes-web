import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User, LayoutDashboard, Heart, Building2, Shield, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import api from '@/lib/axios'

export default function Navbar() {
  const { user, isAuthenticated, clearUser } = useAuthStore()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/signout')
    } catch {
      // Proceed with logout even if server call fails
    }
    clearUser()
    closeMobileMenu()
    navigate('/login')
  }

  const navLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link to="/properties" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
            Browse
          </Link>
          <Link to="/contact" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
            <Phone className="w-4 h-4" /> Contact
          </Link>
          <Link to="/login" onClick={closeMobileMenu}>
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/register" onClick={closeMobileMenu}>
            <Button size="sm">Register</Button>
          </Link>
        </>
      )
    }

    switch (user?.role) {
      case 'buyer':
        return (
          <>
            <Link to="/properties" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Browse
            </Link>
            <Link to="/contact" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Phone className="w-4 h-4" /> Contact
            </Link>
            <Link to="/saved" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Heart className="w-4 h-4" /> Saved
            </Link>
          </>
        )
      case 'owner':
        return (
          <>
            <Link to="/owner/dashboard" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link to="/saved" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Heart className="w-4 h-4" /> Saved
            </Link>
            <Link to="/contact" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Phone className="w-4 h-4" /> Contact
            </Link>
            <Link to="/properties" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Browse
            </Link>
          </>
        )
      case 'admin':
        return (
          <>
            <Link to="/admin/dashboard" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Admin Panel
            </Link>
            <Link to="/saved" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Heart className="w-4 h-4" /> Saved
            </Link>
            <Link to="/contact" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Phone className="w-4 h-4" /> Contact
            </Link>
            <Link to="/properties" onClick={closeMobileMenu} className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Browse
            </Link>
          </>
        )
      default:
        return null
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
            <img src="/logo.jpg" alt="BR-Homes Logo" className="h-10" />
            {/* <span className="text-xl font-bold text-slate-900 tracking-tight">
              BR<span className="text-slate-500">-Homes</span>
            </span> */}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks()}
            {isAuthenticated && (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden lg:block">
                    {user?.name}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout" className="text-slate-500 hover:text-red-600">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-slide-in">
          <div className="px-4 py-4 space-y-3">
            {navLinks()}
            {isAuthenticated && (
              <div className="pt-3 mt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                  <span className="ml-auto text-xs bg-slate-100 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
