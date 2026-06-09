"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const errorMiddleware = (err, _req, res, _next) => {
    if (err instanceof AppError_1.default && err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: { code: err.code },
        });
        return;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        res.status(422).json({
            success: false,
            message: 'Validation failed',
            error: { code: 'VALIDATION_ERROR', details: err.message },
        });
        return;
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
        res.status(409).json({
            success: false,
            message: 'Resource already exists',
            error: { code: 'ALREADY_EXISTS' },
        });
        return;
    }
    console.error('UNHANDLED ERROR:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again.',
        error: { code: 'INTERNAL_ERROR' },
    });
};
exports.default = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map