import { Link } from 'react-router-dom'
import { Home, Phone, MapPin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                BR<span className="text-slate-400">-Homes</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              No-broker real estate marketplace for Amreli, Gujarat. 
              Connect directly with property owners — zero commission.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/properties" className="text-sm hover:text-white transition-colors">Browse Properties</Link></li>
              <li><Link to="/register" className="text-sm hover:text-white transition-colors">List Your Property</Link></li>
              <li><Link to="/login" className="text-sm hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                Amreli, Gujarat, India
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                brhomes.app@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                Contact via listings
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} BR-Homes. All rights reserved. No broker commission — connect directly with owners.
          </p>
        </div>
      </div>
    </footer>
  )
}
