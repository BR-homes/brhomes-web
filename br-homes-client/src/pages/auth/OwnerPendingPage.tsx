import { Clock, Shield } from 'lucide-react'

export default function OwnerPendingPage() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
        <Clock className="w-8 h-8 text-amber-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Approval Pending</h2>
      <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
        Your owner account is pending admin approval. You'll be able to list properties once approved.
      </p>
      <div className="bg-slate-50 rounded-xl p-4 max-w-sm mx-auto">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Shield className="w-4 h-4 text-slate-400" />
          <span>This usually takes less than 24 hours</span>
        </div>
      </div>
    </div>
  )
}
