import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { MailCheck, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      setStatus('verifying')
      api.get(`/api/auth/verify-email?token=${token}`)
        .then(() => { setStatus('success'); setMessage('Your email has been verified!') })
        .catch((err) => { setStatus('error'); setMessage(err.response?.data?.message || 'Verification failed.') })
    }
  }, [token])

  // If no token, show the "check your email" message
  if (!token) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <MailCheck className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
          We've sent a verification link to your email address. Click the link to verify your account.
        </p>
        <p className="text-xs text-slate-400">The link expires in 24 hours</p>
        <Link to="/login" className="block mt-6">
          <Button variant="outline" size="sm">Back to Login</Button>
        </Link>
      </div>
    )
  }

  if (status === 'verifying') {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-slate-400" />
        <p className="text-slate-500">Verifying your email...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Email Verified!</h2>
        <p className="text-slate-500 text-sm mb-6">{message}</p>
        <Link to="/login"><Button>Sign In</Button></Link>
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
        <XCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Verification Failed</h2>
      <p className="text-slate-500 text-sm mb-6">{message}</p>
      <Link to="/login"><Button variant="outline">Back to Login</Button></Link>
    </div>
  )
}
