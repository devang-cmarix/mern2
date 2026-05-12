import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";
import User from "../models/User.js";
import { AuthRequest, asyncHandler } from "../middleware/authMiddleware.js";
import { AppError } from "../middleware/errorMiddleware.js";

export const signup = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new AppError("Missing required fields", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash,
    phone,
  });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  res.status(201).json({
    success: true,
    message: "User created successfully",
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id).select("-passwordHash");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    success: true,
    user,
  });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError("All password fields are required", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError("New passwords do not match", 400);
  }

  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully",
  });
});
