"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("../models/User.model"));
const jwt_1 = require("../utils/jwt");
const optionalSessionGuard = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = (0, jwt_1.verifyToken)(token);
        }
        catch (err) {
            return next();
        }
        if (!decoded || !decoded.id) {
            return next();
        }
        const dbUser = await User_model_1.default.findById(decoded.id).lean();
        if (dbUser && dbUser.isActive) {
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
        }
        next();
    }
    catch (error) {
        return next();
    }
};
exports.default = optionalSessionGuard;
//# sourceMappingURL=optionalSessionGuard.js.map