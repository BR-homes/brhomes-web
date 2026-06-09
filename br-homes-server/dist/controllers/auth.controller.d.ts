import { Request, Response } from 'express';
/**
 * POST /api/auth/login
 * Email/Password login
 */
export declare const login: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * POST /api/auth/google
 * Google OAuth login
 */
export declare const googleLogin: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * POST /api/auth/register
 * Email registration — creates user with hashed password, sends verification email
 */
export declare const register: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/auth/verify-email?token=<raw_token>
 * Verify email using the token from the email link
 */
export declare const verifyEmail: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * POST /api/auth/resend-verification
 * Resend verification email
 */
export declare const resendVerification: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * POST /api/auth/complete-profile
 * Google OAuth users set their role and phone after first sign-in
 */
export declare const completeProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/auth/me
 * Get current user's full profile
 */
export declare const getMe: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=auth.controller.d.ts.map