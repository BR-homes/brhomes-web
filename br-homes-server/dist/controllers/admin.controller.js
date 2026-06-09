"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserImageLimit = exports.updateGlobalImageLimit = exports.getSettings = exports.toggleUserActive = exports.getAllUsers = exports.adminDeleteProperty = exports.getAllProperties = exports.rejectProperty = exports.approveProperty = exports.getPendingProperties = exports.approveOwner = exports.getPendingOwners = exports.getStats = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const responseHandler_1 = require("../utils/responseHandler");
const cloudinaryUtils_1 = require("../utils/cloudinaryUtils");
const User_model_1 = __importDefault(require("../models/User.model"));
const Property_model_1 = __importDefault(require("../models/Property.model"));
const SavedProperty_model_1 = __importDefault(require("../models/SavedProperty.model"));
const AdminAction_model_1 = __importDefault(require("../models/AdminAction.model"));
const Setting_model_1 = __importDefault(require("../models/Setting.model"));
const admin_validation_1 = require("../validations/admin.validation");
/**
 * GET /api/admin/stats
 * Platform overview statistics
 */
exports.getStats = (0, asyncHandler_1.default)(async (_req, res) => {
    const [totalUsers, totalBuyers, totalOwners, totalProperties, pendingProperties, approvedProperties, pendingOwners, totalSaved,] = await Promise.all([
        User_model_1.default.countDocuments(),
        User_model_1.default.countDocuments({ role: 'buyer' }),
        User_model_1.default.countDocuments({ role: 'owner' }),
        Property_model_1.default.countDocuments(),
        Property_model_1.default.countDocuments({ status: 'pending' }),
        Property_model_1.default.countDocuments({ status: 'approved' }),
        User_model_1.default.countDocuments({ role: 'owner', ownerApproved: false, isProfileComplete: true }),
        SavedProperty_model_1.default.countDocuments(),
    ]);
    (0, responseHandler_1.sendSuccess)(res, 'Admin stats retrieved', {
        users: { total: totalUsers, buyers: totalBuyers, owners: totalOwners },
        properties: {
            total: totalProperties,
            pending: pendingProperties,
            approved: approvedProperties,
        },
        pendingOwners,
        totalSaved,
    });
});
/**
 * GET /api/admin/owners/pending
 * List owners awaiting admin approval
 */
exports.getPendingOwners = (0, asyncHandler_1.default)(async (_req, res) => {
    const owners = await User_model_1.default.find({
        role: 'owner',
        ownerApproved: false,
        isProfileComplete: true,
    })
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .lean();
    (0, responseHandler_1.sendSuccess)(res, 'Pending owners retrieved', owners);
});
/**
 * PUT /api/admin/owners/:id/approve
 * Approve an owner account
 */
exports.approveOwner = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await User_model_1.default.findById(req.params.id);
    if (!user || user.role !== 'owner') {
        throw new AppError_1.default('Owner not found', 404, 'NOT_FOUND');
    }
    user.ownerApproved = true;
    await user.save();
    await AdminAction_model_1.default.create({
        adminId: req.sessionUser.id,
        targetId: user._id,
        targetType: 'user',
        action: 'owner_approved',
        actedAt: new Date(),
    });
    (0, responseHandler_1.sendSuccess)(res, 'Owner approved successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        ownerApproved: true,
    });
});
/**
 * GET /api/admin/properties/pending
 * List properties awaiting approval
 */
exports.getPendingProperties = (0, asyncHandler_1.default)(async (_req, res) => {
    const properties = await Property_model_1.default.find({ status: 'pending' })
        .populate('ownerId', 'name email phone')
        .sort({ createdAt: -1 })
        .lean();
    (0, responseHandler_1.sendSuccess)(res, 'Pending properties retrieved', properties);
});
/**
 * PUT /api/admin/properties/:id/approve
 * Approve a property listing
 */
exports.approveProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const property = await Property_model_1.default.findById(req.params.id);
    if (!property) {
        throw new AppError_1.default('Property not found', 404, 'NOT_FOUND');
    }
    property.status = 'approved';
    property.rejectionNote = null;
    await property.save();
    await AdminAction_model_1.default.create({
        adminId: req.sessionUser.id,
        targetId: property._id,
        targetType: 'property',
        action: 'property_approved',
        actedAt: new Date(),
    });
    (0, responseHandler_1.sendSuccess)(res, 'Property approved', property);
});
/**
 * PUT /api/admin/properties/:id/reject
 * Reject a property with a required note
 */
exports.rejectProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const parsed = admin_validation_1.rejectPropertySchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError_1.default('Rejection note is required (min 10 chars)', 422, 'VALIDATION_ERROR');
    }
    const property = await Property_model_1.default.findById(req.params.id);
    if (!property) {
        throw new AppError_1.default('Property not found', 404, 'NOT_FOUND');
    }
    property.status = 'rejected';
    property.rejectionNote = parsed.data.rejectionNote;
    await property.save();
    await AdminAction_model_1.default.create({
        adminId: req.sessionUser.id,
        targetId: property._id,
        targetType: 'property',
        action: 'property_rejected',
        note: parsed.data.rejectionNote,
        actedAt: new Date(),
    });
    (0, responseHandler_1.sendSuccess)(res, 'Property rejected', property);
});
/**
 * GET /api/admin/properties
 * All properties with filtering and pagination
 */
exports.getAllProperties = (0, asyncHandler_1.default)(async (req, res) => {
    const { status, propertyType, city, page = '1', limit = '12', } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (propertyType)
        filter.propertyType = propertyType;
    if (city && typeof city === 'string')
        filter.city = new RegExp(city, 'i');
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;
    const [properties, total] = await Promise.all([
        Property_model_1.default.find(filter)
            .populate('ownerId', 'name email phone')
            .sort({ createdAt: -1 })
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
 * DELETE /api/admin/properties/:id
 * Admin force-delete a property
 */
exports.adminDeleteProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const property = await Property_model_1.default.findById(req.params.id);
    if (!property) {
        throw new AppError_1.default('Property not found', 404, 'NOT_FOUND');
    }
    // Delete Cloudinary images
    const publicIds = property.images.map((img) => img.cloudinaryPublicId);
    await (0, cloudinaryUtils_1.deleteImages)(publicIds);
    // Remove from saved
    await SavedProperty_model_1.default.deleteMany({ propertyId: property._id });
    // Delete property
    await Property_model_1.default.findByIdAndDelete(property._id);
    await AdminAction_model_1.default.create({
        adminId: req.sessionUser.id,
        targetId: property._id,
        targetType: 'property',
        action: 'property_hidden',
        note: 'Deleted by admin',
        actedAt: new Date(),
    });
    (0, responseHandler_1.sendSuccess)(res, 'Property deleted by admin', null);
});
/**
 * GET /api/admin/users
 * All users with filtering
 */
exports.getAllUsers = (0, asyncHandler_1.default)(async (req, res) => {
    const { role, page = '1', limit = '20', search } = req.query;
    const filter = {};
    if (role)
        filter.role = role;
    if (search && typeof search === 'string') {
        filter.$or = [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
        ];
    }
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;
    const [users, total] = await Promise.all([
        User_model_1.default.find(filter)
            .select('-passwordHash')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        User_model_1.default.countDocuments(filter),
    ]);
    (0, responseHandler_1.sendSuccess)(res, 'Users retrieved', users, 200, {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
    });
});
/**
 * PATCH /api/admin/users/:id/deactivate
 * Toggle user active status
 */
exports.toggleUserActive = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await User_model_1.default.findById(req.params.id);
    if (!user) {
        throw new AppError_1.default('User not found', 404, 'NOT_FOUND');
    }
    // Prevent deactivating yourself
    if (user._id.toString() === req.sessionUser.id) {
        throw new AppError_1.default('Cannot deactivate your own account', 400, 'VALIDATION_ERROR');
    }
    user.isActive = !user.isActive;
    await user.save();
    await AdminAction_model_1.default.create({
        adminId: req.sessionUser.id,
        targetId: user._id,
        targetType: 'user',
        action: user.isActive ? 'user_activated' : 'user_deactivated',
        actedAt: new Date(),
    });
    (0, responseHandler_1.sendSuccess)(res, `User ${user.isActive ? 'activated' : 'deactivated'}`, {
        _id: user._id,
        isActive: user.isActive,
    });
});
/**
 * GET /api/admin/settings
 * Get all platform settings
 */
exports.getSettings = (0, asyncHandler_1.default)(async (_req, res) => {
    const settings = await Setting_model_1.default.find().lean();
    (0, responseHandler_1.sendSuccess)(res, 'Settings retrieved', settings);
});
/**
 * PUT /api/admin/settings/image-limit
 * Update global image limit
 */
exports.updateGlobalImageLimit = (0, asyncHandler_1.default)(async (req, res) => {
    const parsed = admin_validation_1.updateGlobalImageLimitSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError_1.default('Validation failed', 422, 'VALIDATION_ERROR');
    }
    const setting = await Setting_model_1.default.findOneAndUpdate({ key: 'globalImageLimit' }, {
        value: parsed.data.globalImageLimit,
        updatedBy: req.sessionUser.id,
        updatedAt: new Date(),
    }, { new: true, upsert: true });
    await AdminAction_model_1.default.create({
        adminId: req.sessionUser.id,
        targetId: setting._id,
        targetType: 'user',
        action: 'image_limit_changed',
        note: `Global image limit set to ${parsed.data.globalImageLimit}`,
        actedAt: new Date(),
    });
    (0, responseHandler_1.sendSuccess)(res, 'Global image limit updated', setting);
});
/**
 * PUT /api/admin/users/:id/image-limit
 * Override image limit for a specific owner
 */
exports.updateUserImageLimit = (0, asyncHandler_1.default)(async (req, res) => {
    const parsed = admin_validation_1.updateImageLimitSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError_1.default('Validation failed', 422, 'VALIDATION_ERROR');
    }
    const user = await User_model_1.default.findByIdAndUpdate(req.params.id, { imageLimit: parsed.data.imageLimit }, { new: true }).select('-passwordHash');
    if (!user) {
        throw new AppError_1.default('User not found', 404, 'NOT_FOUND');
    }
    await AdminAction_model_1.default.create({
        adminId: req.sessionUser.id,
        targetId: user._id,
        targetType: 'user',
        action: 'image_limit_changed',
        note: `Image limit for ${user.name} set to ${parsed.data.imageLimit}`,
        actedAt: new Date(),
    });
    (0, responseHandler_1.sendSuccess)(res, 'User image limit updated', user);
});
//# sourceMappingURL=admin.controller.js.map