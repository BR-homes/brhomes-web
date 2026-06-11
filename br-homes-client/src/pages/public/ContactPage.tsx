import { Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="page-enter max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
      <p className="mb-8 text-slate-500">Reach out to BRHomes for enquiries and support.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Phone Card */}
        <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col justify-between items-start gap-5 transition-all duration-300 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center gap-3 text-slate-800 font-semibold">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <strong>Phone Support</strong>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Direct Line</p>
            <p className="text-slate-700 text-lg font-semibold">9033744146</p>
          </div>
          <a href="tel:9033744146" className="w-full">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm shadow-emerald-100 transition-colors">
              <Phone className="w-4 h-4" /> Call Now
            </Button>
          </a>
        </div>

        {/* Email Card */}
        <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col justify-between items-start gap-5 transition-all duration-300 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center gap-3 text-slate-800 font-semibold">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <strong>Email Support</strong>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Direct Email</p>
            <p className="text-slate-700 text-lg font-semibold">brhomes.app@gmail.com</p>
          </div>
          <a href="mailto:brhomes.app@gmail.com" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm shadow-blue-100 transition-colors">
              <Mail className="w-4 h-4" /> Send Email
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
