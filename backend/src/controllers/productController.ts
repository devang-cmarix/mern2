import { Response } from "express";
import Product from "../models/Product.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category as string;
  const status = req.query.status as string;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string;

  const filter: any = {};

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  const sortObj: Record<string, 1 | -1> = {};
  if (sortBy === "price-asc") sortObj.price = 1;
  else if (sortBy === "price-desc") sortObj.price = -1;
  else if (sortBy === "newest") sortObj.createdAt = -1;
  else sortObj.createdAt = -1;

  const products = await Product.find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortObj);

  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    data: products,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
});

export const getProductById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json({
    success: true,
    data: product,
  });
});

export const getProductsByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find({ category: req.params.category })
    .limit(limit)
    .skip(skip);

  const total = await Product.countDocuments({ category: req.params.category });

  res.json({
    success: true,
    data: products,
    total,
    page,
    limit,
  });
});

export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, sku, price, stock, category, description, images, colors, sizes, discountPrice, status } = req.body;

  if (!name || !sku || !price || !category) {
    throw new AppError("Missing required fields", 400);
  }

  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    throw new AppError("Product with this SKU already exists", 409);
  }

  const product = await Product.create({
    name,
    sku,
    price,
    discountPrice: discountPrice || undefined,
    stock,
    category,
    description,
    images: images || [],
    colors: colors || [],
    sizes: sizes || [],
    status: status || "active",
  });

  res.status(201).json({
    success: true,
    data: product,
    message: "Product created successfully",
  });
});

export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json({
    success: true,
    data: product,
    message: "Product updated successfully",
  });
});

export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const searchProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const query = String(req.params.query || "");

  const filter: any = {
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { sku: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ],
  };

  const products = await Product.find(filter)
    .limit(limit)
    .skip(skip);

  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    data: products,
    total,
    page,
    limit,
  });
});
