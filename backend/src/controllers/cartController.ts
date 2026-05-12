import { Response } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  let cart = await Cart.findOne({ userId: req.user?.id }).populate("items.productId");

  if (!cart) {
    cart = await Cart.create({ userId: req.user?.id, items: [], total: 0 });
  }

  res.json({
    success: true,
    data: cart,
  });
});

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, quantity, color, size } = req.body;

  if (!productId || !quantity) {
    throw new AppError("Product ID and quantity are required", 400);
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  let cart = await Cart.findOne({ userId: req.user?.id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user?.id, items: [], total: 0 });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      item.selectedColor === color &&
      item.selectedSize === size
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: product._id,
      quantity,
      selectedColor: color,
      selectedSize: size,
    });
  }

  // Calculate total
  let total = 0;
  for (const item of cart.items) {
    const prod = await Product.findById(item.productId);
    if (prod) {
      total += prod.price * item.quantity;
    }
  }
  cart.total = total;

  await cart.save();

  res.json({
    success: true,
    data: cart,
    message: "Product added to cart",
  });
});

export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new AppError("Product ID and quantity are required", 400);
  }

  const cart = await Cart.findOne({ userId: req.user?.id });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const item = cart.items.find((item) => item.productId.toString() === productId);
  if (!item) {
    throw new AppError("Item not found in cart", 404);
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  // Calculate total
  let total = 0;
  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.productId);
    if (product) {
      total += product.price * cartItem.quantity;
    }
  }
  cart.total = total;

  await cart.save();

  res.json({
    success: true,
    data: cart,
    message: "Cart updated",
  });
});

export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: req.user?.id });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

  // Calculate total
  let total = 0;
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  cart.total = total;

  await cart.save();

  res.json({
    success: true,
    data: cart,
    message: "Product removed from cart",
  });
});

export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ userId: req.user?.id });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = [];
  cart.total = 0;
  await cart.save();

  res.json({
    success: true,
    message: "Cart cleared",
  });
});
