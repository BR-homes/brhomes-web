import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IVerificationToken extends Document {
  _id: Types.ObjectId
  email: string
  hashedToken: string
  expires: Date
  createdAt: Date
}

const verificationTokenSchema = new Schema<IVerificationToken>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    hashedToken: {
      type: String,
      required: [true, 'Hashed token is required'],
    },
    expires: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'emailVerifications',
  }
)

// TTL index: auto-delete expired verification tokens
verificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

// Index for quick lookups by email
verificationTokenSchema.index({ email: 1 })

const VerificationToken = mongoose.model<IVerificationToken>(
  'VerificationToken',
  verificationTokenSchema
)
export default VerificationToken
