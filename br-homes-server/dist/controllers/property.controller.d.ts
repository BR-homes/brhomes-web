import { Request, Response } from 'express';
/**
 * GET /api/properties
 * Browse approved listings with filtering, pagination, and sorting
 */
export declare const getProperties: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/properties/:id
 * Property detail with owner info (name + phone)
 */
export declare const getPropertyById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * POST /api/properties
 * Create a new property listing (owner only, approved owner)
 */
export declare const createProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * PUT /api/properties/:id
 * Update own property
 */
export declare const updateProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * PATCH /api/properties/:id/hide
 * Toggle property between approved and hidden
 */
export declare const toggleHideProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * PATCH /api/properties/:id/mark
 * Mark property as sold or rented
 */
export declare const markProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * DELETE /api/properties/:id
 * Delete property and all its Cloudinary images
 */
export declare const deleteProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=property.controller.d.ts.map