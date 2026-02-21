import { NextFunction, Request, Response } from "express";

type ExpressRouteHandler<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T> | T;

export function controllerWrapper<T>(routeHandler: ExpressRouteHandler<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await routeHandler(req, res, next);
      
      // Jika res belum dikirim oleh routeHandler secara manual
      if (!res.headersSent) {
        // Jika result ada isinya, kirim sebagai JSON, jika tidak kirim status 204 (No Content)
        if (result !== undefined) {
          res.status(200).json(result);
        } else {
          res.status(204).send(); 
        }
      }
    } catch (error) {
      next(error); // Melempar ke Error Middleware
    }
  };
}