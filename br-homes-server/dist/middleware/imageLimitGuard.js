"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("../models/User.model"));
const Setting_model_1 = __importDefault(require("../models/Setting.model"));
/**
 * Resolves the effective image limit for the current user.
 * Priority: user.imageLimit > globalImageLimit setting > fallback (7)
 * Attaches to req as effectiveImageLimit.
 */
const imageLimitGuard = async (req, _res, next) => {
    try {
        const userId = req.sessionUser?.id;
        if (!userId)
            return next();
        const user = await User_model_1.default.findById(userId).select('imageLimit').lean();
        if (user?.imageLimit != null) {
            ;
            req.effectiveImageLimit = user.imageLimit;
            return next();
        }
        const setting = await Setting_model_1.default.findOne({ key: 'globalImageLimit' }).lean();
        req.effectiveImageLimit = setting?.value ?? 7;
        next();
    }
    catch {
        ;
        req.effectiveImageLimit = 7;
        next();
    }
};
exports.default = imageLimitGuard;
//# sourceMappingURL=imageLimitGuard.js.map