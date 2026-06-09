import { Response } from 'express';
interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare const sendSuccess: <T>(res: Response, message: string, data?: T | null, statusCode?: number, meta?: Meta) => void;
export declare const sendError: (res: Response, message: string, statusCode?: number, code?: string, details?: unknown) => void;
export {};
//# sourceMappingURL=responseHandler.d.ts.map