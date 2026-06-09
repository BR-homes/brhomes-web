"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const roleGuard = (...roles) => {
    return (req, _res, next) => {
        if (!req.sessionUser || !roles.includes(req.sessionUser.role)) {
            return next(new AppError_1.default('Access denied', 403, 'ACCESS_DENIED'));
        }
        next();
    };
};
exports.default = roleGuard;
//# sourceMappingURL=roleGuard.js.map