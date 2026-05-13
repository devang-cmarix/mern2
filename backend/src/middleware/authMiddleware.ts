import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorMiddleware.js";

export interface AuthRequest extends Request {
  user?: {
    _id?: string;
    id?: string;
    email?: string;
    role?: "user" | "admin";
    isAdmin?: boolean;
    type?: "admin";
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as AuthRequest["user"];
    const userId = decoded?.id || decoded?._id;

    req.user = decoded ? { ...decoded, id: userId, _id: userId } : decoded;
    next();
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin" && req.user?.isAdmin !== true) {
    throw new AppError("Access denied. Admin role required", 403);
  }
  next();
};

// Wrapper for async route handlers
export const asyncHandler = (
  fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
