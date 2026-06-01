import 'express'

declare module 'express' {
  interface Request {
    sessionUser?: {
      id: string
      name: string
      email: string
      role: 'buyer' | 'owner' | 'admin'
      image: string | null
      phone: string | null
      isActive: boolean
      isProfileComplete: boolean
      ownerApproved: boolean
    }
  }
}
