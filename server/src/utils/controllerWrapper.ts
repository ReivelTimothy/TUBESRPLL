import { NextFunction, Request, Response } from "express";

// Kita tambahkan Generic 'R' yang secara default adalah Request standar
type ExpressRouteHandler<T, R = Request> = (
  req: R,
  res: Response,
  next: NextFunction
) => Promise<T> | T;

// Tambahkan <R extends Request = Request, T = any>
export function controllerWrapper<R extends Request = Request, T = any>(
  handler: ExpressRouteHandler<T, R>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Kita gunakan 'as R' untuk meyakinkan TS bahwa req ini sesuai dengan tipe yang diminta handler
      const result = await handler(req as R, res, next);
      
      if (!res.headersSent) {
        if (result !== undefined) {
          res.status(200).json({ 
            success: true, 
            message: 'Request berhasil!', 
            data: result 
          });
        } else {
          res.status(204).send(); 
        }
      }
    } catch (error) {
      next(error);
    }
  };
}