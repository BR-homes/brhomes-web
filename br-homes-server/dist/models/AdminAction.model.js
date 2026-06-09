"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const adminActionSchema = new mongoose_1.Schema({
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Admin ID is required'],
    },
    targetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Target ID is required'],
    },
    targetType: {
        type: String,
        enum: ['property', 'user'],
        required: [true, 'Target type is required'],
    },
    action: {
        type: String,
        enum: [
            'property_approved',
            'property_rejected',
            'property_hidden',
            'property_unhidden',
            'owner_approved',
            'owner_rejected',
            'user_deactivated',
            'user_reactivated',
            'user_role_changed',
            'image_limit_updated',
            'setting_updated',
        ],
        required: [true, 'Action is required'],
    },
    note: {
        type: String,
        default: null,
        trim: true,
    },
    actedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    collection: 'adminActions',
});
// Indexes for audit log queries
adminActionSchema.index({ adminId: 1, actedAt: -1 });
adminActionSchema.index({ targetId: 1, targetType: 1 });
adminActionSchema.index({ action: 1 });
const AdminAction = mongoose_1.default.model('AdminAction', adminActionSchema);
exports.default = AdminAction;
//# sourceMappingURL=AdminAction.model.js.map