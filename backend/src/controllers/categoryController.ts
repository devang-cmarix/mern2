import { Response } from "express";
import Category from "../models/Category.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    data: categories,
  });
});

export const getCategoryBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.json({
    success: true,
    data: category,
  });
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    throw new AppError("Category name is required", 400);
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const existingCategory = await Category.findOne({ slug });
  if (existingCategory) {
    throw new AppError("Category already exists", 409);
  }

  const category = await Category.create({
    name,
    slug,
    description,
  });

  res.status(201).json({
    success: true,
    data: category,
    message: "Category created successfully",
  });
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.json({
    success: true,
    data: category,
    message: "Category updated successfully",
  });
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.json({
    success: true,
    message: "Category deleted successfully",
  });
});
