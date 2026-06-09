/**
 * Upload image buffer to Cloudinary.
 * Returns the secure URL and public ID for storage and later deletion.
 */
export declare const uploadImage: (fileBuffer: Buffer, folder?: string) => Promise<{
    imageUrl: string;
    cloudinaryPublicId: string;
}>;
/**
 * Delete an image from Cloudinary by its public ID.
 * Must be called before removing a property from DB.
 */
export declare const deleteImage: (publicId: string) => Promise<void>;
/**
 * Delete multiple images from Cloudinary.
 */
export declare const deleteImages: (publicIds: string[]) => Promise<void>;
/**
 * Upload video buffer to Cloudinary.
 * Returns the secure URL and public ID.
 */
export declare const uploadVideo: (fileBuffer: Buffer, folder?: string) => Promise<{
    videoUrl: string;
    cloudinaryPublicId: string;
}>;
//# sourceMappingURL=cloudinaryUtils.d.ts.map