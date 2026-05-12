import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    throw new AppError("Password is required", 400);
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password !== adminPassword) {
    throw new AppError("Invalid admin password", 401);
  }

  const token = jwt.sign(
    { isAdmin: true, type: "admin" },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "8h" }
  );

  res.json({
    success: true,
    message: "Admin authenticated successfully",
    token,
  });
});

export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "firstName lastName email");

  const topProducts = await Product.find()
    .sort({ rating: -1 })
    .limit(5);

  const ordersResult = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  const totalRevenue = ordersResult[0]?.totalRevenue || 0;

  res.json({
    success: true,
    data: {
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      recentOrders,
      topProducts,
    },
  });
});

export const getOrderStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        total: { $sum: "$total" },
      },
    },
  ]);

  res.json({
    success: true,
    data: stats,
  });
});

export const getSalesStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const stats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: last30Days },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        sales: { $sum: "$total" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.json({
    success: true,
    data: stats,
  });
});

export const getProductStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        totalStock: { $sum: "$stock" },
      },
    },
  ]);

  res.json({
    success: true,
    data: stats,
  });
});
