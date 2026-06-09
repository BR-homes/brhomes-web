declare class AppError extends Error {
    statusCode: number;
    code: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number, code: string);
}
export default AppError;
//# sourceMappingURL=AppError.d.ts.map