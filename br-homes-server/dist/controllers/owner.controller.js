"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerStats = exports.getOwnerProperties = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const responseHandler_1 = require("../utils/responseHandler");
const Property_model_1 = __importDefault(require("../models/Property.model"));
const Setting_model_1 = __importDefault(require("../models/Setting.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
/**
 * GET /api/owner/properties
 * Get all properties belonging to the current owner
 */
exports.getOwnerProperties = (0, asyncHandler_1.default)(async (req, res) => {
    const ownerId = req.sessionUser.id;
    const properties = await Property_model_1.default.find({ ownerId })
        .sort({ createdAt: -1 })
        .lean();
    (0, responseHandler_1.sendSuccess)(res, 'Owner properties retrieved', properties);
});
/**
 * GET /api/owner/stats
 * Get owner dashboard statistics + effective image limit
 */
exports.getOwnerStats = (0, asyncHandler_1.default)(async (req, res) => {
    const ownerId = req.sessionUser.id;
    const [total, pending, approved, rejected, hidden, sold, rented, user, globalSetting] = await Promise.all([
        Property_model_1.default.countDocuments({ ownerId }),
        Property_model_1.default.countDocuments({ ownerId, status: 'pending' }),
        Property_model_1.default.countDocuments({ ownerId, status: 'approved' }),
        Property_model_1.default.countDocuments({ ownerId, status: 'rejected' }),
        Property_model_1.default.countDocuments({ ownerId, status: 'hidden' }),
        Property_model_1.default.countDocuments({ ownerId, status: 'sold' }),
        Property_model_1.default.countDocuments({ ownerId, status: 'rented' }),
        User_model_1.default.findById(ownerId).select('imageLimit').lean(),
        Setting_model_1.default.findOne({ key: 'globalImageLimit' }).lean(),
    ]);
    const effectiveImageLimit = user?.imageLimit ?? globalSetting?.value ?? 7;
    (0, responseHandler_1.sendSuccess)(res, 'Owner stats retrieved', {
        total,
        pending,
        approved,
        rejected,
        hidden,
        sold,
        rented,
        effectiveImageLimit,
    });
});
//# sourceMappingURL=owner.controller.js.map