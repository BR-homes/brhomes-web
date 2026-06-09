import { Request, Response } from 'express';
/**
 * GET /api/owner/properties
 * Get all properties belonging to the current owner
 */
export declare const getOwnerProperties: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/owner/stats
 * Get owner dashboard statistics + effective image limit
 */
export declare const getOwnerStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=owner.controller.d.ts.map