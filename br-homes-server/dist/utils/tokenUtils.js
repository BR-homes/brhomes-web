"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = exports.generateVerificationToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate a raw verification token and its SHA-256 hash.
 * Raw token is sent in the email link; hashed token is stored in DB.
 */
const generateVerificationToken = () => {
    const rawToken = crypto_1.default.randomBytes(32).toString('hex');
    const hashedToken = (0, exports.hashToken)(rawToken);
    return { rawToken, hashedToken };
};
exports.generateVerificationToken = generateVerificationToken;
/**
 * Hash a token using SHA-256. Used to compare incoming tokens against stored hashes.
 */
const hashToken = (token) => {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
};
exports.hashToken = hashToken;
//# sourceMappingURL=tokenUtils.js.map