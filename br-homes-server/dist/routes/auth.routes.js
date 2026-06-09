"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionGuard_1 = __importDefault(require("../middleware/sessionGuard"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// Public routes
router.post('/login', auth_controller_1.login);
router.post('/google', auth_controller_1.googleLogin);
router.post('/register', auth_controller_1.register);
router.get('/verify-email', auth_controller_1.verifyEmail);
router.post('/resend-verification', auth_controller_1.resendVerification);
// Protected routes (require session)
router.post('/complete-profile', sessionGuard_1.default, auth_controller_1.completeProfile);
router.get('/me', sessionGuard_1.default, auth_controller_1.getMe);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map