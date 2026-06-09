import { Request, Response, NextFunction } from 'express';
/**
 * Resolves the effective image limit for the current user.
 * Priority: user.imageLimit > globalImageLimit setting > fallback (7)
 * Attaches to req as effectiveImageLimit.
 */
declare const imageLimitGuard: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export default imageLimitGuard;
//# sourceMappingURL=imageLimitGuard.d.ts.map