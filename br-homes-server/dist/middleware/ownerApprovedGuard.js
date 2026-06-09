"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const ownerApprovedGuard = (req, _res, next) => {
    if (!req.sessionUser?.ownerApproved) {
        return next(new AppError_1.default('Your owner account is pending admin approval', 403, 'OWNER_NOT_APPROVED'));
    }
    next();
};
exports.default = ownerApprovedGuard;
//# sourceMappingURL=ownerApprovedGuard.js.map