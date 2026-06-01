import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ISession extends Document {
  _id: Types.ObjectId
  sessionToken: string
  userId: Types.ObjectId
  expires: Date
}

const sessionSchema = new Schema<ISession>(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'sessions',
  }
)

// TTL index: MongoDB auto-deletes expired sessions
sessionSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

const Session = mongoose.model<ISession>('Session', sessionSchema)
export default Session
