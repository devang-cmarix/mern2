import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  status?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as ApiError;
  res.status(404);
  next(error);
};

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || res.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    status,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export class AppError extends Error implements ApiError {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}
