import mongoose, { Document, Schema } from 'mongoose'

export interface IService extends Document {
  title: string
  description?: string
  contactPhone: string
  categoryId: mongoose.Types.ObjectId
  isActive: boolean
  createdAt: Date
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true, default: '' },
  contactPhone: { type: String, required: true, trim: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  isActive: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IService>('Service', ServiceSchema)
