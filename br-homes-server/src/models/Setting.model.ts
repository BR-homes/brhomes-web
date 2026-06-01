import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ISetting extends Document {
  _id: Types.ObjectId
  key: string
  value: unknown
  updatedBy: Types.ObjectId | null
  updatedAt: Date
}

const settingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: [true, 'Setting key is required'],
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: [true, 'Setting value is required'],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'settings',
  }
)

const Setting = mongoose.model<ISetting>('Setting', settingSchema)
export default Setting
