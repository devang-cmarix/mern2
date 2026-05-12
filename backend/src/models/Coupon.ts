import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minOrderAmount?: number;
  maxUses?: number;
  usesCount: number;
  expiryDate?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    minOrderAmount: { type: Number },
    maxUses: { type: Number },
    usesCount: { type: Number, default: 0 },
    expiryDate: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>("Coupon", couponSchema);
