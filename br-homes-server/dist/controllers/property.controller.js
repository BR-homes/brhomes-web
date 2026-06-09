"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.markProperty = exports.toggleHideProperty = exports.updateProperty = exports.createProperty = exports.getPropertyById = exports.getProperties = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const responseHandler_1 = require("../utils/responseHandler");
const cloudinaryUtils_1 = require("../utils/cloudinaryUtils");
const Property_model_1 = __importDefault(require("../models/Property.model"));
const SavedProperty_model_1 = __importDefault(require("../models/SavedProperty.model"));
const property_validation_1 = require("../validations/property.validation");
/**
 * GET /api/properties
 * Browse approved listings with filtering, pagination, and sorting
 */
exports.getProperties = (0, asyncHandler_1.default)(async (req, res) => {
    const { city, propertyType, listingType, bhk, minPrice, maxPrice, sort = 'newest', page = '1', limit = '12', search, } = req.query;
    // Build filter query — only show approved properties to public
    const filter = { status: 'approved' };
    if (city && typeof city === 'string')
        filter.city = new RegExp(city, 'i');
    if (propertyType)
        filter.propertyType = propertyType;
    if (listingType)
        filter.listingType = listingType;
    if (bhk)
        filter.bhk = Number(bhk);
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice)
            filter.price.$gte = Number(minPrice);
        if (maxPrice)
            filter.price.$lte = Number(maxPrice);
    }
    if (search && typeof search === 'string') {
        filter.$or = [
            { title: new RegExp(search, 'i') },
            { areaLocality: new RegExp(search, 'i') },
            { city: new RegExp(search, 'i') },
        ];
    }
    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc')
        sortOption = { price: 1 };
    if (sort === 'price_desc')
        sortOption = { price: -1 };
    // Pagination
    const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;
    const [properties, total] = await Promise.all([
        Property_model_1.default.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Property_model_1.default.countDocuments(filter),
    ]);
    (0, responseHandler_1.sendSuccess)(res, 'Properties retrieved', properties, 200, {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
    });
});
/**
 * GET /api/properties/:id
 * Property detail with owner info (name + phone)
 */
exports.getPropertyById = (0, asyncHandler_1.default)(async (req, res) => {
    const property = await Property_model_1.default.findById(req.params.id)
        .populate('ownerId', 'name phone image')
        .lean();
    if (!property) {
        throw new AppError_1.default('Property not found', 404, 'NOT_FOUND');
    }
    // Public users can only see approved (or sold/rented) properties
    if (!['approved', 'sold', 'rented'].includes(property.status)) {
        // Allow owner and admin to see any status
        const userId = req.sessionUser?.id;
        const isOwner = property.ownerId?._id?.toString() === userId;
        const isAdmin = req.sessionUser?.role === 'admin';
        if (!isOwner && !isAdmin) {
            throw new AppError_1.default('Property not found', 404, 'NOT_FOUND');
        }
    }
    (0, responseHandler_1.sendSuccess)(res, 'Property retrieved', property);
});
/**
 * POST /api/properties
 * Create a new property listing (owner only, approved owner)
 */
exports.createProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const parsed = property_validation_1.createPropertySchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError_1.default('Validation failed', 422, 'VALIDATION_ERROR');
    }
    const files = req.files;
    const effectiveImageLimit = req.effectiveImageLimit || 7;
    if (files && files.length > effectiveImageLimit) {
        throw new AppError_1.default(`You can upload a maximum of ${effectiveImageLimit} images`, 400, 'IMAGE_LIMIT_EXCEEDED');
    }
    // Upload images to Cloudinary
    const images = [];
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const result = await (0, cloudinaryUtils_1.uploadImage)(files[i].buffer);
            images.push({
                imageUrl: result.imageUrl,
                cloudinaryPublicId: result.cloudinaryPublicId,
                isPrimary: i === 0,
            });
        }
    }
    const data = parsed.data;
    const bhk = data.bhk;
    const property = await Property_model_1.default.create({
        ...data,
        bhk,
        ownerId: req.sessionUser.id,
        status: 'pending',
        images,
    });
    (0, responseHandler_1.sendSuccess)(res, 'Property created and submitted for review', property, 201);
});
/**
 * PUT /api/properties/:id
 * Update own property
 */
exports.updateProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const property = await Property_model_1.default.findById(req.params.id);
    if (!property) {
        throw new AppError_1.default('Property not found', 404, 'NOT_FOUND');
    }
    // Only the owner can edit
    if (property.ownerId.toString() !== req.sessionUser.id) {
        throw new AppError_1.default('Access denied', 403, 'ACCESS_DENIED');
    }
    const parsed = property_validation_1.updatePropertySchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError_1.default('Validation failed', 422, 'VALIDATION_ERROR');
    }
    const { removeImages, ...updateData } = parsed.data;
    const effectiveImageLimit = req.effectiveImageLimit || 7;
    // Remove specified images from Cloudinary
    if (removeImages && removeImages.length > 0) {
        await (0, cloudinaryUtils_1.deleteImages)(removeImages);
        property.images = property.images.filter((img) => !removeImages.includes(img.cloudinaryPublicId));
    }
    // Upload new images
    const files = req.files;
    const currentImageCount = property.images.length;
    const newFileCount = files?.length || 0;
    if (currentImageCount + newFileCount > effectiveImageLimit) {
        throw new AppError_1.default(`Total images cannot exceed ${effectiveImageLimit}`, 400, 'IMAGE_LIMIT_EXCEEDED');
    }
    if (files && files.length > 0) {
        for (const file of files) {
            const result = await (0, cloudinaryUtils_1.uploadImage)(file.buffer);
            property.images.push({
                imageUrl: result.imageUrl,
                cloudinaryPublicId: result.cloudinaryPublicId,
                isPrimary: property.images.length === 0,
            });
        }
    }
    // Ensure at least one primary image
    if (property.images.length > 0 && !property.images.some((img) => img.isPrimary)) {
        property.images[0].isPrimary = true;
    }
    // Apply text updates
    Object.assign(property, updateData);
    // Re-set status to pending on edit (needs re-approval)
    if (['approved', 'rejected'].includes(property.status)) {
        property.status = 'pending';
        property.rejectionNote = null;
    }
    await property.save();
    (0, responseHandler_1.sendSuccess)(res, 'Property updated successfully', property);
});
/**
 * PATCH /api/properties/:id/hide
 * Toggle property between approved and hidden
 */
exports.toggleHideProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const property = await Property_model_1.default.findById(req.params.id);
    if (!property) {
        throw new AppError_1.default('Property not found', 404, 'NOT_FOUND');
    }
    if (property.ownerId.toString() !== req.sessionUser.id) {
        throw new AppError_1.default('Access denied', 403, 'ACCESS_DENIED');
    }
    if (!['approved', 'hidden'].includes(property.status)) {
        throw new AppError_1.default('Only approved or hidden properties can be toggled', 400, 'VALIDATION_ERROR');
    }
    property.status = property.status === 'approved' ? 'hidden' : 'approved';
    await property.save();
    (0, responseHandler_1.sendSuccess)(res, `Property ${property.status === 'hidden' ? 'hidden' : 'visible'} successfully`, property);
});
/**
 * PATCH /api/properties/:id/mark
 * Mark property as sold or rented
 */
exports.markProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const property = await Property_model_1.default.findById(req.params.id);
    if (!property) {
        throw new AppError_1.default('Property not found', 404, 'NOT_FOUND');
    }
    if (property.ownerId.toString() !== req.sessionUser.id) {
        throw new AppError_1.default('Access denied', 403, 'ACCESS_DENIED');
    }
    const parsed = property_validation_1.markPropertySchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError_1.default('Validation failed', 422, 'VALIDATION_ERROR');
    }
    property.status = parsed.data.status;
    await property.save();
    (0, responseHandler_1.sendSuccess)(res, `Property marked as ${parsed.data.status}`, property);
});
/**
 * DELETE /api/properties/:id
 * Delete property and all its Cloudinary images
 */
exports.deleteProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const property = await Property_model_1.default.findById(req.params.id);
    if (!property) {
        throw new AppError_1.default('Property not found', 404, 'NOT_FOUND');
    }
    if (property.ownerId.toString() !== req.sessionUser.id) {
        throw new AppError_1.default('Access denied', 403, 'ACCESS_DENIED');
    }
    // Delete all images from Cloudinary
    const publicIds = property.images.map((img) => img.cloudinaryPublicId);
    await (0, cloudinaryUtils_1.deleteImages)(publicIds);
    // Remove from saved properties
    await SavedProperty_model_1.default.deleteMany({ propertyId: property._id });
    // Delete property
    await Property_model_1.default.findByIdAndDelete(property._id);
    (0, responseHandler_1.sendSuccess)(res, 'Property deleted successfully', null);
});
//# sourceMappingURL=property.controller.js.map