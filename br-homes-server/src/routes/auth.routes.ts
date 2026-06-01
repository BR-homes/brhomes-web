import { Router } from 'express'
import sessionGuard from '../middleware/sessionGuard'
import {
  login,
  googleLogin,
  register,
  verifyEmail,
  resendVerification,
  completeProfile,
  getMe,
} from '../controllers/auth.controller'

const router = Router()

// Public routes
router.post('/login', login)
router.post('/google', googleLogin)
router.post('/register', register)
router.get('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerification)

// Protected routes (require session)
router.post('/complete-profile', sessionGuard, completeProfile)
router.get('/me', sessionGuard, getMe)

export default router
