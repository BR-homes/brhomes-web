import mongoose, { Document, Schema } from 'mongoose'

export interface ISidebarAd extends Document {
  videoUrl: string
  cloudinaryPublicId: string
  createdAt: Date
}

const SidebarAdSchema = new Schema<ISidebarAd>({
  videoUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<ISidebarAd>('SidebarAd', SidebarAdSchema)
