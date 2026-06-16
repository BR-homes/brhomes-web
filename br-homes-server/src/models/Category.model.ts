import mongoose, { Document, Schema } from 'mongoose'

export interface ICategory extends Document {
  title: string
  imageUrl: string
  cloudinaryPublicId: string
  isActive: boolean
  createdAt: Date
}

const CategorySchema = new Schema<ICategory>({
  title: { type: String, required: true, unique: true, trim: true },
  imageUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<ICategory>('Category', CategorySchema)
