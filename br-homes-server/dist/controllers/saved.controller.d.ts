import { Request, Response } from 'express';
/**
 * GET /api/saved
 * Get all saved properties for the current buyer
 */
export declare const getSavedProperties: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * POST /api/saved/:propertyId
 * Save a property to favorites
 */
export declare const saveProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * DELETE /api/saved/:propertyId
 * Remove a property from saved list
 */
export declare const unsaveProperty: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=saved.controller.d.ts.map