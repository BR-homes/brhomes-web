"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const User_model_1 = __importDefault(require("../models/User.model"));
const jwt_1 = require("../utils/jwt");
const sessionGuard = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError_1.default('Authentication required', 401, 'AUTH_REQUIRED'));
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = (0, jwt_1.verifyToken)(token);
        }
        catch (err) {
            return next(new AppError_1.default('Authentication required', 401, 'AUTH_REQUIRED'));
        }
        if (!decoded || !decoded.id) {
            return next(new AppError_1.default('Authentication required', 401, 'AUTH_REQUIRED'));
        }
        const dbUser = await User_model_1.default.findById(decoded.id).lean();
        if (!dbUser) {
            return next(new AppError_1.default('Authentication required', 401, 'AUTH_REQUIRED'));
        }
        if (!dbUser.isActive) {
            return next(new AppError_1.default('Your account has been deactivated', 403, 'ACCOUNT_DEACTIVATED'));
        }
        if (!dbUser.isProfileComplete) {
            if (!req.originalUrl.includes('/complete-profile') &&
                !req.originalUrl.includes('/me')) {
                return next(new AppError_1.default('Please complete your profile first', 403, 'PROFILE_INCOMPLETE'));
            }
        }
        req.sessionUser = {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            image: dbUser.image ?? null,
            phone: dbUser.phone ?? null,
            isActive: dbUser.isActive,
            isProfileComplete: dbUser.isProfileComplete,
            ownerApproved: dbUser.ownerApproved,
        };
        next();
    }
    catch (error) {
        return next(new AppError_1.default('Authentication required', 401, 'AUTH_REQUIRED'));
    }
};
exports.default = sessionGuard;
//# sourceMappingURL=sessionGuard.js.map