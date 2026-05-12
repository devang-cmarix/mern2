import { Response } from "express";
import Wishlist from "../models/Wishlist.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  let wishlist = await Wishlist.findOne({ userId: req.user?.id }).populate("items.productId");

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user?.id, items: [] });
  }

  res.json({
    success: true,
    data: wishlist,
  });
});

export const addToWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  let wishlist = await Wishlist.findOne({ userId: req.user?.id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user?.id, items: [] });
  }

  const existingItem = wishlist.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    throw new AppError("Product already in wishlist", 400);
  }

  wishlist.items.push({ productId });
  await wishlist.save();

  res.json({
    success: true,
    data: wishlist,
    message: "Added to wishlist",
  });
});

export const removeFromWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ userId: req.user?.id });
  if (!wishlist) {
    throw new AppError("Wishlist not found", 404);
  }

  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId
  );
  await wishlist.save();

  res.json({
    success: true,
    data: wishlist,
    message: "Removed from wishlist",
  });
});

export const clearWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await Wishlist.findOne({ userId: req.user?.id });
  if (!wishlist) {
    throw new AppError("Wishlist not found", 404);
  }

  wishlist.items = [];
  await wishlist.save();

  res.json({
    success: true,
    message: "Wishlist cleared",
  });
});
