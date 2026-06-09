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
const accountSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    providerAccountId: {
        type: String,
        required: true,
    },
    access_token: {
        type: String,
        default: null,
    },
    refresh_token: {
        type: String,
        default: null,
    },
    expires_at: {
        type: Number,
        default: null,
    },
    token_type: {
        type: String,
        default: null,
    },
    scope: {
        type: String,
        default: null,
    },
    id_token: {
        type: String,
        default: null,
    },
    session_state: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
    collection: 'accounts',
});
// Compound unique index: one account per provider per providerAccountId
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });
const Account = mongoose_1.default.model('Account', accountSchema);
exports.default = Account;
//# sourceMappingURL=Account.model.js.map