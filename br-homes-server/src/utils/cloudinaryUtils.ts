import { cloudinary } from '../config/cloudinary'

/**
 * Upload image buffer to Cloudinary.
 * Returns the secure URL and public ID for storage and later deletion.
 */
export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string = 'br-homes/properties'
): Promise<{ imageUrl: string; cloudinaryPublicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'))
        }
        resolve({
          imageUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
        })
      }
    )
    stream.end(fileBuffer)
  })
}

/**
 * Delete an image from Cloudinary by its public ID.
 * Must be called before removing a property from DB.
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId)
}

/**
 * Delete a video from Cloudinary by its public ID.
 * Videos require resource_type: 'video' to be deleted properly.
 */
export const deleteVideo = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
}

/**
 * Delete multiple images from Cloudinary.
 */
export const deleteImages = async (publicIds: string[]): Promise<void> => {
  if (publicIds.length === 0) return
  const promises = publicIds.map((id) => deleteImage(id))
  await Promise.allSettled(promises)
}

/**
 * Upload video buffer to Cloudinary.
 * Returns the secure URL and public ID.
 */
export const uploadVideo = async (
  fileBuffer: Buffer,
  folder: string = 'br-homes/videos'
): Promise<{ videoUrl: string; cloudinaryPublicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'video',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Video upload failed'))
        }
        resolve({
          videoUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
        })
      }
    )
    stream.end(fileBuffer)
  })
}

