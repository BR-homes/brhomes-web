import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Phone, Search, Building2, Home, Store, LandPlot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PropertyGrid from '@/components/common/PropertyGrid'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { useFeaturedProperties } from '@/hooks/useProperties'

export default function HomePage() {
  const { data, isLoading } = useFeaturedProperties()
  const properties = data?.data || []

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-slate-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6 border border-white/10">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200">No Brokers · No Commission · Direct Contact</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Find Your Perfect<br />
              <span className="bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent">
                Property in Amreli
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
              Browse houses, flats, shops, and land directly from owners. 
              Zero commission — just call the owner and make a deal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/properties">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-300 font-semibold shadow-lg shadow-white/10">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/20 text-white hover:bg-white/10 hover:font-bold">
                  List Your Property
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Home, label: 'Houses', type: 'house', color: 'bg-blue-50 text-blue-600' },
              { icon: Building2, label: 'Flats', type: 'flat', color: 'bg-purple-50 text-purple-600' },
              { icon: Store, label: 'Shops', type: 'shop', color: 'bg-amber-50 text-amber-600' },
              { icon: LandPlot, label: 'Land', type: 'land', color: 'bg-emerald-50 text-emerald-600' },
            ].map((item) => (
              <Link
                key={item.type}
                to={`/properties?propertyType=${item.type}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500 max-w-md mx-auto">Simple, transparent, and commission-free</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse Properties', desc: 'Search and filter houses, flats, shops, and land in Amreli and nearby areas.' },
              { step: '02', title: 'Contact Owner', desc: "See the owner's phone number right on the listing. Call directly — no middleman." },
              { step: '03', title: 'Make a Deal', desc: 'Negotiate and finalize directly with the owner. Save thousands in broker commission.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all duration-300">
                <span className="text-4xl font-bold text-slate-100 absolute top-4 right-6">{item.step}</span>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Latest Properties</h2>
              <p className="text-slate-500">Recently listed properties in Amreli</p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="hidden sm:flex">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : (
            <PropertyGrid properties={properties} emptyMessage="No properties listed yet. Be the first to list!" />
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/properties">
              <Button variant="outline" className="w-full">
                View All Properties <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Phone className="w-10 h-10 mx-auto mb-4 text-slate-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Own a Property?</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            List it for free and connect directly with buyers. No broker fees, ever.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold">
              Start Listing Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
