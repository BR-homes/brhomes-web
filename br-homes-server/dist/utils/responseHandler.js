"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, message, data = null, statusCode = 200, meta) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
        ...(meta && { meta }),
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 500, code = 'INTERNAL_ERROR', details) => {
    res.status(statusCode).json({
        success: false,
        message,
        error: { code, ...(details !== undefined && { details }) },
    });
};
exports.sendError = sendError;
//# sourceMappingURL=responseHandler.js.map