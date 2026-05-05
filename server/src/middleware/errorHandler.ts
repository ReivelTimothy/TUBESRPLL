import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Tentukan status code (default 500 jika bukan ApiError)
  const statusCode = err.statusCode || 500;
  
  // Tentukan internal error code (default 'SYSTEM_ERROR')
  const errorCode = err.code || 'SYSTEM_ERROR';

  // Kirimkan response dalam format JSON
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: errorCode,
    // Stack hanya dikirim saat development agar mudah debug
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};