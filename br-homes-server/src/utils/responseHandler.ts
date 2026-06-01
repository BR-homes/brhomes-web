import { Response } from 'express'

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T | null = null,
  statusCode = 200,
  meta?: Meta
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  })
}

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  details?: unknown
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    error: { code, ...(details !== undefined && { details }) },
  })
}
