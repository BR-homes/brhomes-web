import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IUser extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  emailVerified: Date | null
  image: string | null
  passwordHash: string | null
  phone: string | null
  role: 'buyer' | 'owner' | 'admin'
  isActive: boolean
  isProfileComplete: boolean
  ownerApproved: boolean
  imageLimit: number | null
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'owner', 'admin'],
      default: 'buyer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    ownerApproved: {
      type: Boolean,
      default: false,
    },
    imageLimit: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
)

// Indexes
userSchema.index({ role: 1 })
userSchema.index({ ownerApproved: 1 })
userSchema.index({ isActive: 1 })

const User = mongoose.model<IUser>('User', userSchema)
export default User
