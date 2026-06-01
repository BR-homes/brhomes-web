import mongoose, { Schema, Document, Types } from 'mongoose'

export type AdminActionType =
  | 'property_approved'
  | 'property_rejected'
  | 'property_hidden'
  | 'property_unhidden'
  | 'owner_approved'
  | 'owner_rejected'
  | 'user_deactivated'
  | 'user_reactivated'
  | 'user_role_changed'
  | 'image_limit_updated'
  | 'setting_updated'

export interface IAdminAction extends Document {
  _id: Types.ObjectId
  adminId: Types.ObjectId
  targetId: Types.ObjectId
  targetType: 'property' | 'user'
  action: AdminActionType
  note: string | null
  actedAt: Date
}

const adminActionSchema = new Schema<IAdminAction>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin ID is required'],
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Target ID is required'],
    },
    targetType: {
      type: String,
      enum: ['property', 'user'],
      required: [true, 'Target type is required'],
    },
    action: {
      type: String,
      enum: [
        'property_approved',
        'property_rejected',
        'property_hidden',
        'property_unhidden',
        'owner_approved',
        'owner_rejected',
        'user_deactivated',
        'user_reactivated',
        'user_role_changed',
        'image_limit_updated',
        'setting_updated',
      ],
      required: [true, 'Action is required'],
    },
    note: {
      type: String,
      default: null,
      trim: true,
    },
    actedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'adminActions',
  }
)

// Indexes for audit log queries
adminActionSchema.index({ adminId: 1, actedAt: -1 })
adminActionSchema.index({ targetId: 1, targetType: 1 })
adminActionSchema.index({ action: 1 })

const AdminAction = mongoose.model<IAdminAction>(
  'AdminAction',
  adminActionSchema
)
export default AdminAction
