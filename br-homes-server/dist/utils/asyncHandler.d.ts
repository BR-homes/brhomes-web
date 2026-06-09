import { Request, Response, NextFunction, RequestHandler } from 'express';
declare const asyncHandler: (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => void;
export default asyncHandler;
//# sourceMappingURL=asyncHandler.d.ts.map