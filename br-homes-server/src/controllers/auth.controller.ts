import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'
import { sendSuccess } from '../utils/responseHandler'
import { generateVerificationToken, hashToken } from '../utils/tokenUtils'
import { sendVerificationEmail } from '../utils/email'
import User from '../models/User.model'
import VerificationToken from '../models/VerificationToken.model'
import {
  registerSchema,
  completeProfileSchema,
  resendVerificationSchema,
} from '../validations/auth.validation'
import { generateToken } from '../utils/jwt'
import { OAuth2Client } from 'google-auth-library'
import { env } from '../config/env'

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)

/**
 * POST /api/auth/login
 * Email/Password login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR')
  }

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403, 'ACCOUNT_DEACTIVATED')
  }

  if (!user.emailVerified) {
    throw new AppError('Please verify your email before logging in', 403, 'EMAIL_NOT_VERIFIED')
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
  }

  const token = generateToken(user._id.toString())

  sendSuccess(res, 'Login successful', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      phone: user.phone,
      isProfileComplete: user.isProfileComplete,
      ownerApproved: user.ownerApproved,
      isActive: user.isActive
    },
  })
})

/**
 * POST /api/auth/google
 * Google OAuth login
 */
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body
  if (!token) {
    throw new AppError('Google token is required', 400, 'VALIDATION_ERROR')
  }

  // Fetch user profile from Google using the access token
  const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!googleRes.ok) {
    throw new AppError('Invalid Google token', 401, 'INVALID_CREDENTIALS')
  }

  const payload = (await googleRes.json()) as any
  const { email, name, picture } = payload

  if (!email) {
    throw new AppError('Google account must have an email', 400, 'VALIDATION_ERROR')
  }

  let user = await User.findOne({ email: email.toLowerCase() })

  if (!user) {
    user = await User.create({
      email: email.toLowerCase(),
      name: name || 'Google User',
      image: picture || null,
      emailVerified: new Date(),
      passwordHash: '',
      isProfileComplete: false,
      ownerApproved: false,
      isActive: true,
      role: 'buyer' // default role, will be updated in complete-profile
    })
  } else {
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 403, 'ACCOUNT_DEACTIVATED')
    }
  }

  const jwtToken = generateToken(user._id.toString())

  sendSuccess(res, 'Login successful', {
    token: jwtToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      phone: user.phone,
      isProfileComplete: user.isProfileComplete,
      ownerApproved: user.ownerApproved,
      isActive: user.isActive
    },
  })
})

/**
 * POST /api/auth/register
 * Email registration - creates user with hashed password, sends verification email
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new AppError('Validation failed', 422, 'VALIDATION_ERROR')
  }

  const { name, email, phone, password, role } = parsed.data

  // Check if email already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409, 'ALREADY_EXISTS')
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    role,
    emailVerified: null,
    isProfileComplete: true,
    ownerApproved: false,
    isActive: true,
  })

  // Generate verification token
  const { rawToken, hashedToken } = generateVerificationToken()

  // Delete any existing verification tokens for this email
  await VerificationToken.deleteMany({ email })

  // Store hashed token
  await VerificationToken.create({
    email,
    hashedToken,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  })

  // Send verification email
  try {
    await sendVerificationEmail(email, name, rawToken)
  } catch (error) {
    console.error('Failed to send verification email:', error)
    // Don't fail registration if email fails - user can resend
  }

  sendSuccess(
    res,
    'Registration successful! Please check your email to verify your account.',
    { userId: user._id, email: user.email },
    201
  )
})

/**
 * GET /api/auth/verify-email?token=<raw_token>
 * Verify email using the token from the email link
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token = req.query.token as string

  if (!token) {
    throw new AppError('Verification token is required', 400, 'VALIDATION_ERROR')
  }

  // Hash the incoming token and find match
  const hashedToken = hashToken(token)
  const verificationRecord = await VerificationToken.findOne({ hashedToken })

  if (!verificationRecord) {
    throw new AppError(
      'Invalid or expired verification link',
      400,
      'VALIDATION_ERROR'
    )
  }

  // Check expiry
  if (verificationRecord.expires < new Date()) {
    await VerificationToken.deleteOne({ _id: verificationRecord._id })
    throw new AppError(
      'Verification link has expired. Please request a new one.',
      400,
      'VALIDATION_ERROR'
    )
  }

  // Verify the user
  const user = await User.findOneAndUpdate(
    { email: verificationRecord.email },
    { emailVerified: new Date() },
    { new: true }
  )

  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND')
  }

  // Delete the verification record
  await VerificationToken.deleteOne({ _id: verificationRecord._id })

  sendSuccess(res, 'Email verified successfully! You can now sign in.', null)
})

/**
 * POST /api/auth/resend-verification
 * Resend verification email
 */
export const resendVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = resendVerificationSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError('Valid email is required', 422, 'VALIDATION_ERROR')
    }

    const { email } = parsed.data
    const user = await User.findOne({ email })

    if (!user) {
      // Don't reveal if email exists
      sendSuccess(
        res,
        'If an account exists with this email, a verification link has been sent.'
      )
      return
    }

    if (user.emailVerified) {
      throw new AppError('Email is already verified', 400, 'VALIDATION_ERROR')
    }

    // Delete old tokens and create new one
    await VerificationToken.deleteMany({ email })
    const { rawToken, hashedToken } = generateVerificationToken()

    await VerificationToken.create({
      email,
      hashedToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    try {
      await sendVerificationEmail(email, user.name, rawToken)
    } catch (error) {
      console.error('Failed to send verification email:', error)
      throw new AppError(
        'Failed to send verification email. Please try again.',
        500,
        'INTERNAL_ERROR'
      )
    }

    sendSuccess(
      res,
      'If an account exists with this email, a verification link has been sent.'
    )
  }
)

/**
 * POST /api/auth/complete-profile
 * Google OAuth users set their role and phone after first sign-in
 */
export const completeProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = completeProfileSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError('Validation failed', 422, 'VALIDATION_ERROR')
    }

    const { phone, role } = parsed.data
    const userId = req.sessionUser!.id

    const user = await User.findByIdAndUpdate(
      userId,
      {
        phone,
        role,
        isProfileComplete: true,
        ownerApproved: role === 'buyer', // Buyers are auto-approved; owners need admin approval
      },
      { new: true }
    )

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND')
    }

    const token = generateToken(user._id.toString())

    sendSuccess(res, 'Profile completed successfully', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isProfileComplete: user.isProfileComplete,
        ownerApproved: user.ownerApproved,
        isActive: user.isActive,
        image: user.image
      }
    })
  }
)

/**
 * GET /api/auth/me
 * Get current user's full profile
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.sessionUser!.id)
    .select('-passwordHash')
    .lean()

  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND')
  }

  sendSuccess(res, 'User profile retrieved', user)
})

/**
 * POST /api/auth/signout
 * Signout user
 */
export const signout = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, 'Logout successful', null)
})

