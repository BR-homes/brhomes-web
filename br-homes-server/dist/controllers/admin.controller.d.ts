import { Request, Response } from 'express';
/**
 * GET /api/admin/stats
 * Platform overview statistics
 */
export declare const getStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/admin/owners/pending
 * List owners awaiting admin approval
 */
export declare const getPendingOwners: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * PUT /api/admin/owners/:id/approve
 * Approve an owner account
 */
export declare const approveOwner: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/admin/properties/pending
 * List properties awaiting approval
 */
export declare const getPendingProperties: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * PUT /api/admin/properties/:id/approve
 * Approve a property listing
 */
export declare const approveProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * PUT /api/admin/properties/:id/reject
 * Reject a property with a required note
 */
export declare const rejectProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/admin/properties
 * All properties with filtering and pagination
 */
export declare const getAllProperties: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * DELETE /api/admin/properties/:id
 * Admin force-delete a property
 */
export declare const adminDeleteProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/admin/users
 * All users with filtering
 */
export declare const getAllUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * PATCH /api/admin/users/:id/deactivate
 * Toggle user active status
 */
export declare const toggleUserActive: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/admin/settings
 * Get all platform settings
 */
export declare const getSettings: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * PUT /api/admin/settings/image-limit
 * Update global image limit
 */
export declare const updateGlobalImageLimit: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * PUT /api/admin/users/:id/image-limit
 * Override image limit for a specific owner
 */
export declare const updateUserImageLimit: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=admin.controller.d.ts.map