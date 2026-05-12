import { Response } from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { billingDetails, paymentMethod, couponCode } = req.body;

  const cart = await Cart.findOne({ userId: req.user?.id }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  const items = cart.items.map((item: any) => ({
    productId: item.productId._id,
    productName: item.productId.name,
    quantity: item.quantity,
    price: item.productId.price,
    subtotal: item.productId.price * item.quantity,
  }));

  let subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  let discount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode, active: true });
    if (!coupon) {
      throw new AppError("Invalid coupon code", 400);
    }

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      throw new AppError("Coupon has expired", 400);
    }

    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discount) / 100;
    } else {
      discount = coupon.discount;
    }

    coupon.usesCount += 1;
    await coupon.save();
  }

  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  const order = await Order.create({
    orderId: generateOrderId(),
    userId: req.user?.id,
    items,
    billingDetails,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    couponCode,
    paymentMethod,
    status: "pending",
  });

  // Clear cart
  cart.items = [];
  cart.total = 0;
  await cart.save();

  res.status(201).json({
    success: true,
    data: order,
    message: "Order created successfully",
  });
});

export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ userId: req.user?.id })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments({ userId: req.user?.id });

  res.json({
    success: true,
    data: orders,
    total,
    page,
    limit,
  });
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.userId.toString() !== req.user?.id && req.user?.role !== "admin") {
    throw new AppError("Unauthorized", 403);
  }

  res.json({
    success: true,
    data: order,
  });
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  res.json({
    success: true,
    data: order,
    message: "Order status updated",
  });
});

export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.status !== "pending" && order.status !== "processing") {
    throw new AppError("Cannot cancel this order", 400);
  }

  order.status = "cancelled";
  await order.save();

  res.json({
    success: true,
    data: order,
    message: "Order cancelled successfully",
  });
});

export const deleteOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  res.json({
    success: true,
    message: "Order deleted successfully",
  });
});

export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const status = req.query.status as string;

  const filter: any = {};
  if (status) filter.status = status;

  const orders = await Order.find(filter)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    data: orders,
    total,
    page,
    limit,
  });
});
