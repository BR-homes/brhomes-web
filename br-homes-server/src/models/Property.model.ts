import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IPropertyImage {
  imageUrl: string
  cloudinaryPublicId: string
  isPrimary: boolean
}

export interface IProperty extends Document {
  _id: Types.ObjectId
  ownerId: Types.ObjectId
  customOwnerName: string | null
  title: string
  description: string
  propertyType: 'house' | 'flat'
  listingType: 'sale' | 'rent'
  bhk: number | null
  areaSqft: number | null
  price: number
  city: string
  areaLocality: string
  pincode: string
  contactPhone: string
  status: 'pending' | 'approved' | 'rejected' | 'hidden' | 'sold' | 'rented'
  approvalRequestedAt: Date | null
  approvedAt: Date | null
  approvedBy: Types.ObjectId | null
  rejectedAt: Date | null
  rejectedBy: Types.ObjectId | null
  rejectionNote: string | null
  images: IPropertyImage[]
  createdAt: Date
  updatedAt: Date
}

const propertyImageSchema = new Schema<IPropertyImage>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
)

const propertySchema = new Schema<IProperty>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true,
    },
    customOwnerName: {
      type: String,
      default: null,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ['house', 'flat'],
      required: [true, 'Property type is required'],
    },
    listingType: {
      type: String,
      enum: ['sale', 'rent'],
      required: [true, 'Listing type is required'],
    },
    bhk: {
      type: Number,
      default: null,
      min: [1, 'BHK must be between 1 and 5'],
      max: [5, 'BHK must be between 1 and 5'],
    },
    areaSqft: {
      type: Number,
      default: null,
      min: [1, 'Area must be positive'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    areaLocality: {
      type: String,
      required: [true, 'Area/Locality is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'hidden', 'sold', 'rented'],
      default: 'pending',
    },
    approvalRequestedAt: {
      type: Date,
      default: null,
      index: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionNote: {
      type: String,
      default: null,
      trim: true,
    },
    images: {
      type: [propertyImageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'properties',
  }
)

// Compound index for filtered property listing queries
propertySchema.index({
  status: 1,
  city: 1,
  propertyType: 1,
  listingType: 1,
})

// Queue index for pending approval processing
propertySchema.index({ status: 1, approvalRequestedAt: 1, createdAt: 1 })

const Property = mongoose.model<IProperty>('Property', propertySchema)
export default Property
