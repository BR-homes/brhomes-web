import { Phone, Mail } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="page-enter max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6">Reach out to BRHomes for enquiries and support.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2"><Phone className="w-5 h-5" /> <strong>Phone</strong></div>
          <div>9033744146</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2"><Mail className="w-5 h-5" /> <strong>Email</strong></div>
          <div>brhomes.app@gmail.com</div>
        </div>
      </div>
    </div>
  )
}
