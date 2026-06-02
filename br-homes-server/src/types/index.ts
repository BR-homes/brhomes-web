export type PropertyType = 'house' | 'flat'
export type ListingType = 'sale' | 'rent'
export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'hidden' | 'sold' | 'rented'
export type UserRole = 'buyer' | 'owner' | 'admin'

export interface IPropertyImage {
  imageUrl: string
  cloudinaryPublicId: string
  isPrimary: boolean
}

export interface IApiResponse<T> {
  success: true
  message: string
  data: T | null
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface IApiErrorResponse {
  success: false
  message: string
  error: {
    code: string
    details?: unknown
  }
}
