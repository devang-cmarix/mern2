import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  description: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviews?: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
