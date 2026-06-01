import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IAccount extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  type: string
  provider: string
  providerAccountId: string
  access_token: string | null
  refresh_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
      default: null,
    },
    refresh_token: {
      type: String,
      default: null,
    },
    expires_at: {
      type: Number,
      default: null,
    },
    token_type: {
      type: String,
      default: null,
    },
    scope: {
      type: String,
      default: null,
    },
    id_token: {
      type: String,
      default: null,
    },
    session_state: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'accounts',
  }
)

// Compound unique index: one account per provider per providerAccountId
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true })

const Account = mongoose.model<IAccount>('Account', accountSchema)
export default Account
