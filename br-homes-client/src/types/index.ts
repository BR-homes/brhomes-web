export interface IUser {
  _id: string
  name: string
  email: string
  emailVerified: string | null
  image: string | null
  phone: string | null
  role: 'buyer' | 'owner' | 'admin'
  isActive: boolean
  isProfileComplete: boolean
  ownerApproved: boolean
  imageLimit: number | null
  createdAt: string
  updatedAt?: string
}

export interface IPropertyImage {
  imageUrl: string
  cloudinaryPublicId: string
  isPrimary: boolean
}

export type PropertyType = 'house' | 'flat'
export type ListingType = 'sale' | 'rent'
export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'hidden' | 'sold' | 'rented'

export interface IProperty {
  _id: string
  ownerId: string | { _id: string; name: string; phone: string; email?: string; image?: string }
  title: string
  description: string
  propertyType: PropertyType
  listingType: ListingType
  bhk: number | null
  areaSqft: number | null
  price: number
  city: string
  areaLocality: string
  pincode: string
  contactPhone: string
  status: PropertyStatus
  rejectionNote: string | null
  images: IPropertyImage[]
  createdAt: string
  updatedAt: string
}

export interface IApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  error?: { code: string; details?: unknown }
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ISavedProperty {
  _id: string
  savedAt: string
  property: IProperty
}

export interface IOwnerStats {
  total: number
  pending: number
  approved: number
  rejected: number
  hidden: number
  sold: number
  rented: number
  effectiveImageLimit: number
}

export interface IAdminStats {
  users: { total: number; buyers: number; owners: number }
  properties: { total: number; pending: number; approved: number }
  pendingOwners: number
  totalSaved: number
}

export interface ISetting {
  _id: string
  key: string
  value: unknown
  updatedBy: string | null
  updatedAt: string
}

export interface ISidebarAd {
  _id: string
  videoUrl: string
  cloudinaryPublicId: string
  createdAt: string
}
