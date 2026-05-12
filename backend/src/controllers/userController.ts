import bcrypt from "bcrypt";
import { Response } from "express";
import User from "../models/User.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id).select("-passwordHash");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, email, phone, address } = req.body;

  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  await user.save();

  res.json({
    success: true,
    data: user,
    message: "Profile updated successfully",
  });
});

export const createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new AppError("Missing required fields", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash,
    phone,
    role: "user",
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    message: "User created successfully",
  });
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, email, phone, password } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Admin users cannot be edited", 403);
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (password) {
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  await user.save();

  res.json({
    success: true,
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    message: "User updated successfully",
  });
});
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-passwordHash")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments();

  res.json({
    success: true,
    data: users,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
});

export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Admin users cannot be deleted", 403);
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "User deleted successfully",
  });
});
