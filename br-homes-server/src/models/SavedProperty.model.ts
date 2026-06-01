import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ISavedProperty extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  propertyId: Types.ObjectId
  savedAt: Date
}

const savedPropertySchema = new Schema<ISavedProperty>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required'],
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'savedProperties',
  }
)

// Compound unique index: a user can save a property only once
savedPropertySchema.index({ userId: 1, propertyId: 1 }, { unique: true })

const SavedProperty = mongoose.model<ISavedProperty>(
  'SavedProperty',
  savedPropertySchema
)
export default SavedProperty
