import { Response } from "express";
import Coupon from "../models/Coupon.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const validateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code } = req.body;

  if (!code) {
    throw new AppError("Coupon code is required", 400);
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

  if (!coupon) {
    throw new AppError("Invalid coupon code", 400);
  }

  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    throw new AppError("Coupon has expired", 400);
  }

  if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) {
    throw new AppError("Coupon has reached maximum uses", 400);
  }

  res.json({
    success: true,
    data: coupon,
  });
});

export const getCoupons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const coupons = await Coupon.find()
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Coupon.countDocuments();

  res.json({
    success: true,
    data: coupons,
    total,
    page,
    limit,
  });
});

export const createCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, discount, discountType, minOrderAmount, maxUses, expiryDate } = req.body;

  if (!code || !discount || !discountType) {
    throw new AppError("Missing required fields", 400);
  }

  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    throw new AppError("Coupon code already exists", 409);
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discount,
    discountType,
    minOrderAmount,
    maxUses,
    expiryDate,
    active: true,
  });

  res.status(201).json({
    success: true,
    data: coupon,
    message: "Coupon created successfully",
  });
});

export const updateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    throw new AppError("Coupon not found", 404);
  }

  res.json({
    success: true,
    data: coupon,
    message: "Coupon updated successfully",
  });
});

export const deleteCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    throw new AppError("Coupon not found", 404);
  }

  res.json({
    success: true,
    message: "Coupon deleted successfully",
  });
});
