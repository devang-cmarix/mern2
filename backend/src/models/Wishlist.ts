import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IWishlist>("Wishlist", wishlistSchema);
