"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.completeProfile = exports.resendVerification = exports.verifyEmail = exports.register = exports.googleLogin = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const responseHandler_1 = require("../utils/responseHandler");
const tokenUtils_1 = require("../utils/tokenUtils");
const email_1 = require("../utils/email");
const User_model_1 = __importDefault(require("../models/User.model"));
const VerificationToken_model_1 = __importDefault(require("../models/VerificationToken.model"));
const auth_validation_1 = require("../validations/auth.validation");
const jwt_1 = require("../utils/jwt");
const google_auth_library_1 = require("google-auth-library");
const env_1 = require("../config/env");
const client = new google_auth_library_1.OAuth2Client(env_1.env.GOOGLE_CLIENT_ID);
/**
 * POST /api/auth/login
 * Email/Password login
 */
exports.login = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError_1.default('Email and password are required', 400, 'VALIDATION_ERROR');
    }
    const user = await User_model_1.default.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) {
        throw new AppError_1.default('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }
    if (!user.isActive) {
        throw new AppError_1.default('Your account has been deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }
    if (!user.emailVerified) {
        throw new AppError_1.default('Please verify your email before logging in', 403, 'EMAIL_NOT_VERIFIED');
    }
    const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isValid) {
        throw new AppError_1.default('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }
    const token = (0, jwt_1.generateToken)(user._id.toString());
    (0, responseHandler_1.sendSuccess)(res, 'Login successful', {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            phone: user.phone,
            isProfileComplete: user.isProfileComplete,
            ownerApproved: user.ownerApproved,
            isActive: user.isActive
        },
    });
});
/**
 * POST /api/auth/google
 * Google OAuth login
 */
exports.googleLogin = (0, asyncHandler_1.default)(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        throw new AppError_1.default('Google token is required', 400, 'VALIDATION_ERROR');
    }
    // Fetch user profile from Google using the access token
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!googleRes.ok) {
        throw new AppError_1.default('Invalid Google token', 401, 'INVALID_CREDENTIALS');
    }
    const payload = (await googleRes.json());
    const { email, name, picture } = payload;
    if (!email) {
        throw new AppError_1.default('Google account must have an email', 400, 'VALIDATION_ERROR');
    }
    let user = await User_model_1.default.findOne({ email: email.toLowerCase() });
    if (!user) {
        user = await User_model_1.default.create({
            email: email.toLowerCase(),
            name: name || 'Google User',
            image: picture || null,
            emailVerified: new Date(),
            passwordHash: '',
            isProfileComplete: false,
            ownerApproved: false,
            isActive: true,
            role: 'buyer' // default role, will be updated in complete-profile
        });
    }
    else {
        if (!user.isActive) {
            throw new AppError_1.default('Your account has been deactivated', 403, 'ACCOUNT_DEACTIVATED');
        }
    }
    const jwtToken = (0, jwt_1.generateToken)(user._id.toString());
    (0, responseHandler_1.sendSuccess)(res, 'Login successful', {
        token: jwtToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            phone: user.phone,
            isProfileComplete: user.isProfileComplete,
            ownerApproved: user.ownerApproved,
            isActive: user.isActive
        },
    });
});
/**
 * POST /api/auth/register
 * Email registration — creates user with hashed password, sends verification email
 */
exports.register = (0, asyncHandler_1.default)(async (req, res) => {
    const parsed = auth_validation_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError_1.default('Validation failed', 422, 'VALIDATION_ERROR');
    }
    const { name, email, phone, password, role } = parsed.data;
    // Check if email already exists
    const existingUser = await User_model_1.default.findOne({ email });
    if (existingUser) {
        throw new AppError_1.default('An account with this email already exists', 409, 'ALREADY_EXISTS');
    }
    // Hash password
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    // Create user
    const user = await User_model_1.default.create({
        name,
        email,
        phone,
        passwordHash,
        role,
        emailVerified: null,
        isProfileComplete: true,
        ownerApproved: false,
        isActive: true,
    });
    // Generate verification token
    const { rawToken, hashedToken } = (0, tokenUtils_1.generateVerificationToken)();
    // Delete any existing verification tokens for this email
    await VerificationToken_model_1.default.deleteMany({ email });
    // Store hashed token
    await VerificationToken_model_1.default.create({
        email,
        hashedToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
    // Send verification email
    try {
        await (0, email_1.sendVerificationEmail)(email, name, rawToken);
    }
    catch (error) {
        console.error('Failed to send verification email:', error);
        // Don't fail registration if email fails — user can resend
    }
    (0, responseHandler_1.sendSuccess)(res, 'Registration successful! Please check your email to verify your account.', { userId: user._id, email: user.email }, 201);
});
/**
 * GET /api/auth/verify-email?token=<raw_token>
 * Verify email using the token from the email link
 */
exports.verifyEmail = (0, asyncHandler_1.default)(async (req, res) => {
    const token = req.query.token;
    if (!token) {
        throw new AppError_1.default('Verification token is required', 400, 'VALIDATION_ERROR');
    }
    // Hash the incoming token and find match
    const hashedToken = (0, tokenUtils_1.hashToken)(token);
    const verificationRecord = await VerificationToken_model_1.default.findOne({ hashedToken });
    if (!verificationRecord) {
        throw new AppError_1.default('Invalid or expired verification link', 400, 'VALIDATION_ERROR');
    }
    // Check expiry
    if (verificationRecord.expires < new Date()) {
        await VerificationToken_model_1.default.deleteOne({ _id: verificationRecord._id });
        throw new AppError_1.default('Verification link has expired. Please request a new one.', 400, 'VALIDATION_ERROR');
    }
    // Verify the user
    const user = await User_model_1.default.findOneAndUpdate({ email: verificationRecord.email }, { emailVerified: new Date() }, { new: true });
    if (!user) {
        throw new AppError_1.default('User not found', 404, 'NOT_FOUND');
    }
    // Delete the verification record
    await VerificationToken_model_1.default.deleteOne({ _id: verificationRecord._id });
    (0, responseHandler_1.sendSuccess)(res, 'Email verified successfully! You can now sign in.', null);
});
/**
 * POST /api/auth/resend-verification
 * Resend verification email
 */
exports.resendVerification = (0, asyncHandler_1.default)(async (req, res) => {
    const parsed = auth_validation_1.resendVerificationSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError_1.default('Valid email is required', 422, 'VALIDATION_ERROR');
    }
    const { email } = parsed.data;
    const user = await User_model_1.default.findOne({ email });
    if (!user) {
        // Don't reveal if email exists
        (0, responseHandler_1.sendSuccess)(res, 'If an account exists with this email, a verification link has been sent.');
        return;
    }
    if (user.emailVerified) {
        throw new AppError_1.default('Email is already verified', 400, 'VALIDATION_ERROR');
    }
    // Delete old tokens and create new one
    await VerificationToken_model_1.default.deleteMany({ email });
    const { rawToken, hashedToken } = (0, tokenUtils_1.generateVerificationToken)();
    await VerificationToken_model_1.default.create({
        email,
        hashedToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    try {
        await (0, email_1.sendVerificationEmail)(email, user.name, rawToken);
    }
    catch (error) {
        console.error('Failed to send verification email:', error);
        throw new AppError_1.default('Failed to send verification email. Please try again.', 500, 'INTERNAL_ERROR');
    }
    (0, responseHandler_1.sendSuccess)(res, 'If an account exists with this email, a verification link has been sent.');
});
/**
 * POST /api/auth/complete-profile
 * Google OAuth users set their role and phone after first sign-in
 */
exports.completeProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const parsed = auth_validation_1.completeProfileSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError_1.default('Validation failed', 422, 'VALIDATION_ERROR');
    }
    const { phone, role } = parsed.data;
    const userId = req.sessionUser.id;
    const user = await User_model_1.default.findByIdAndUpdate(userId, {
        phone,
        role,
        isProfileComplete: true,
        ownerApproved: role === 'buyer', // Buyers are auto-approved; owners need admin approval
    }, { new: true });
    if (!user) {
        throw new AppError_1.default('User not found', 404, 'NOT_FOUND');
    }
    const token = (0, jwt_1.generateToken)(user._id.toString());
    (0, responseHandler_1.sendSuccess)(res, 'Profile completed successfully', {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            isProfileComplete: user.isProfileComplete,
            ownerApproved: user.ownerApproved,
            isActive: user.isActive,
            image: user.image
        }
    });
});
/**
 * GET /api/auth/me
 * Get current user's full profile
 */
exports.getMe = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await User_model_1.default.findById(req.sessionUser.id)
        .select('-passwordHash')
        .lean();
    if (!user) {
        throw new AppError_1.default('User not found', 404, 'NOT_FOUND');
    }
    (0, responseHandler_1.sendSuccess)(res, 'User profile retrieved', user);
});
//# sourceMappingURL=auth.controller.js.map