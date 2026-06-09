"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = exports.deleteImages = exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("../config/cloudinary");
/**
 * Upload image buffer to Cloudinary.
 * Returns the secure URL and public ID for storage and later deletion.
 */
const uploadImage = async (fileBuffer, folder = 'br-homes/properties') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.cloudinary.uploader.upload_stream({
            folder,
            resource_type: 'image',
            transformation: [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' },
            ],
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error('Upload failed'));
            }
            resolve({
                imageUrl: result.secure_url,
                cloudinaryPublicId: result.public_id,
            });
        });
        stream.end(fileBuffer);
    });
};
exports.uploadImage = uploadImage;
/**
 * Delete an image from Cloudinary by its public ID.
 * Must be called before removing a property from DB.
 */
const deleteImage = async (publicId) => {
    await cloudinary_1.cloudinary.uploader.destroy(publicId);
};
exports.deleteImage = deleteImage;
/**
 * Delete multiple images from Cloudinary.
 */
const deleteImages = async (publicIds) => {
    if (publicIds.length === 0)
        return;
    const promises = publicIds.map((id) => (0, exports.deleteImage)(id));
    await Promise.allSettled(promises);
};
exports.deleteImages = deleteImages;
/**
 * Upload video buffer to Cloudinary.
 * Returns the secure URL and public ID.
 */
const uploadVideo = async (fileBuffer, folder = 'br-homes/videos') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.cloudinary.uploader.upload_stream({
            folder,
            resource_type: 'video',
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error('Video upload failed'));
            }
            resolve({
                videoUrl: result.secure_url,
                cloudinaryPublicId: result.public_id,
            });
        });
        stream.end(fileBuffer);
    });
};
exports.uploadVideo = uploadVideo;
//# sourceMappingURL=cloudinaryUtils.js.map