"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSidebarAd = exports.uploadSidebarAds = exports.getSidebarAds = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const responseHandler_1 = require("../utils/responseHandler");
const cloudinaryUtils_1 = require("../utils/cloudinaryUtils");
const SidebarAd_model_1 = __importDefault(require("../models/SidebarAd.model"));
exports.getSidebarAds = (0, asyncHandler_1.default)(async (_req, res) => {
    const ads = await SidebarAd_model_1.default.find().sort({ createdAt: -1 }).lean();
    (0, responseHandler_1.sendSuccess)(res, 'Sidebar ads retrieved', ads);
});
exports.uploadSidebarAds = (0, asyncHandler_1.default)(async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0)
        throw new AppError_1.default('No videos provided', 400, 'VALIDATION_ERROR');
    const created = [];
    for (let i = 0; i < files.length; i++) {
        const result = await (0, cloudinaryUtils_1.uploadVideo)(files[i].buffer, 'br-homes/sidebar-ads');
        const doc = await SidebarAd_model_1.default.create({ videoUrl: result.videoUrl, cloudinaryPublicId: result.cloudinaryPublicId });
        created.push(doc);
    }
    (0, responseHandler_1.sendSuccess)(res, 'Sidebar ads uploaded', created, 201);
});
exports.deleteSidebarAd = (0, asyncHandler_1.default)(async (req, res) => {
    const img = await SidebarAd_model_1.default.findById(req.params.id);
    if (!img)
        throw new AppError_1.default('Video not found', 404, 'NOT_FOUND');
    await (0, cloudinaryUtils_1.deleteImage)(img.cloudinaryPublicId);
    await SidebarAd_model_1.default.findByIdAndDelete(img._id);
    (0, responseHandler_1.sendSuccess)(res, 'Sidebar ad deleted', null);
});
//# sourceMappingURL=sidebarAd.controller.js.map