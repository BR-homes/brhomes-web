import { Request, Response, NextFunction } from 'express';
declare const roleGuard: (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
export default roleGuard;
//# sourceMappingURL=roleGuard.d.ts.map