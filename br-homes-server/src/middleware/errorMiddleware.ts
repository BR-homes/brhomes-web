import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/AppError'

const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: { code: err.code },
    })
    return
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      error: { code: 'VALIDATION_ERROR', details: err.message },
    })
    return
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Resource already exists',
      error: { code: 'ALREADY_EXISTS' },
    })
    return
  }

  console.error('UNHANDLED ERROR:', err)
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again.',
    error: { code: 'INTERNAL_ERROR' },
  })
}

export default errorMiddleware
