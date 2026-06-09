"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveProperty = exports.saveProperty = exports.getSavedProperties = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const responseHandler_1 = require("../utils/responseHandler");
const SavedProperty_model_1 = __importDefault(require("../models/SavedProperty.model"));
/**
 * GET /api/saved
 * Get all saved properties for the current buyer
 */
exports.getSavedProperties = (0, asyncHandler_1.default)(async (req, res) => {
    const saved = await SavedProperty_model_1.default.find({ userId: req.sessionUser.id })
        .populate({
        path: 'propertyId',
        match: { status: { $in: ['approved', 'sold', 'rented'] } },
    })
        .sort({ savedAt: -1 })
        .lean();
    // Filter out nulls (deleted or non-approved properties)
    const properties = saved
        .filter((s) => s.propertyId != null)
        .map((s) => ({
        _id: s._id,
        savedAt: s.savedAt,
        property: s.propertyId,
    }));
    (0, responseHandler_1.sendSuccess)(res, 'Saved properties retrieved', properties);
});
/**
 * POST /api/saved/:propertyId
 * Save a property to favorites
 */
exports.saveProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.sessionUser.id;
    try {
        const saved = await SavedProperty_model_1.default.create({
            userId,
            propertyId,
            savedAt: new Date(),
        });
        (0, responseHandler_1.sendSuccess)(res, 'Property saved', saved, 201);
    }
    catch (error) {
        if (error.code === 11000) {
            throw new AppError_1.default('Property is already saved', 409, 'ALREADY_EXISTS');
        }
        throw error;
    }
});
/**
 * DELETE /api/saved/:propertyId
 * Remove a property from saved list
 */
exports.unsaveProperty = (0, asyncHandler_1.default)(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.sessionUser.id;
    const result = await SavedProperty_model_1.default.findOneAndDelete({
        userId,
        propertyId,
    });
    if (!result) {
        throw new AppError_1.default('Saved property not found', 404, 'NOT_FOUND');
    }
    (0, responseHandler_1.sendSuccess)(res, 'Property removed from saved', null);
});
//# sourceMappingURL=saved.controller.js.map