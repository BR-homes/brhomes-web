"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSliderImage = exports.uploadSliderImages = exports.getSliderImages = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const responseHandler_1 = require("../utils/responseHandler");
const cloudinaryUtils_1 = require("../utils/cloudinaryUtils");
const SliderImage_model_1 = __importDefault(require("../models/SliderImage.model"));
exports.getSliderImages = (0, asyncHandler_1.default)(async (_req, res) => {
    const images = await SliderImage_model_1.default.find().sort({ createdAt: -1 }).lean();
    (0, responseHandler_1.sendSuccess)(res, 'Slider images retrieved', images);
});
exports.uploadSliderImages = (0, asyncHandler_1.default)(async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0)
        throw new AppError_1.default('No images provided', 400, 'VALIDATION_ERROR');
    const created = [];
    for (let i = 0; i < files.length; i++) {
        const result = await (0, cloudinaryUtils_1.uploadImage)(files[i].buffer, 'br-homes/slider');
        const doc = await SliderImage_model_1.default.create({ imageUrl: result.imageUrl, cloudinaryPublicId: result.cloudinaryPublicId });
        created.push(doc);
    }
    (0, responseHandler_1.sendSuccess)(res, 'Slider images uploaded', created, 201);
});
exports.deleteSliderImage = (0, asyncHandler_1.default)(async (req, res) => {
    const img = await SliderImage_model_1.default.findById(req.params.id);
    if (!img)
        throw new AppError_1.default('Image not found', 404, 'NOT_FOUND');
    await (0, cloudinaryUtils_1.deleteImage)(img.cloudinaryPublicId);
    await SliderImage_model_1.default.findByIdAndDelete(img._id);
    (0, responseHandler_1.sendSuccess)(res, 'Slider image deleted', null);
});
//# sourceMappingURL=slider.controller.js.map