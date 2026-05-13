import { Response } from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

const getUserId = (req: AuthRequest) => req.user?.id || req.user?._id;

export const getReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const productId = req.query.productId as string;
  const userId = req.query.userId as string;
  const status = req.query.status as string;

  const filter: any = {};

  if (productId) filter.productId = productId;
  if (userId) filter.userId = userId;
  if (status) filter.status = status;

  const reviews = await Review.find(filter)
    .populate("userId", "firstName lastName")
    .populate("productId", "name images")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments(filter);

  res.json({
    success: true,
    data: reviews,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
});

export const getUserReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ userId })
    .populate("productId", "name images price discountPrice")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments({ userId });

  res.json({
    success: true,
    data: reviews,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
});

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const { productId, rating, comment } = req.body;
  const normalizedComment = typeof comment === "string" ? comment.trim() : "";

  if (!productId || !rating || !normalizedComment) {
    throw new AppError("Product ID, rating, and comment are required", 400);
  }

  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ userId, productId });
  if (existingReview) {
    throw new AppError("You have already reviewed this product", 400);
  }

  const review = await Review.create({
    userId,
    productId,
    rating,
    comment: normalizedComment,
    status: "approved",
  });

  // Update product rating and review count
  await updateProductRating(productId);

  res.status(201).json({
    success: true,
    data: review,
    message: "Review submitted successfully",
  });
});

export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findOne({ _id: id, userId });
  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (rating !== undefined) {
    if (rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }
    review.rating = rating;
  }

  if (comment !== undefined) {
    review.comment = comment;
  }

  await review.save();

  // Update product rating
  await updateProductRating(review.productId);

  res.json({
    success: true,
    data: review,
    message: "Review updated successfully",
  });
});

export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const { id } = req.params;

  const review = await Review.findOneAndDelete({ _id: id, userId });
  if (!review) {
    throw new AppError("Review not found", 404);
  }

  // Update product rating
  await updateProductRating(review.productId);

  res.json({
    success: true,
    message: "Review deleted successfully",
  });
});

export const adminDeleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user || (req.user.role !== "admin" && req.user.isAdmin !== true)) {
    throw new AppError("Admin access required", 403);
  }

  const { id } = req.params;

  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    throw new AppError("Review not found", 404);
  }

  await updateProductRating(review.productId);

  res.json({
    success: true,
    message: "Review deleted successfully",
  });
});

export const updateReviewStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Admin only
  if (!req.user || req.user.role !== "admin") {
    throw new AppError("Admin access required", 403);
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const review = await Review.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("userId", "firstName lastName").populate("productId", "name");

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  res.json({
    success: true,
    data: review,
    message: "Review status updated successfully",
  });
});

const updateProductRating = async (productId: string | mongoose.Types.ObjectId) => {
  const reviews = await Review.find({ productId, status: "approved" });

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviews: 0 });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviews: reviews.length,
  });
};
