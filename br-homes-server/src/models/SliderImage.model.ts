import mongoose, { Document, Schema } from 'mongoose'

export interface ISliderImage extends Document {
  imageUrl: string
  cloudinaryPublicId: string
  createdAt: Date
}

const SliderImageSchema = new Schema<ISliderImage>({
  imageUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<ISliderImage>('SliderImage', SliderImageSchema)
