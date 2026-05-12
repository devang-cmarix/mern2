import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import Coupon from "./models/Coupon.js";

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mern-ecommerce";
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create categories
    const categories = await Category.insertMany([
      { name: "Electronics", slug: "electronics", description: "Electronic devices and gadgets" },
      { name: "Sports", slug: "sports", description: "Sports and fitness equipment" },
      { name: "Accessories", slug: "accessories", description: "Various accessories" },
      { name: "Fashion", slug: "fashion", description: "Fashion and clothing" },
    ]);
    console.log("✅ Categories created");

    // Create products
    const products = await Product.insertMany([
      {
        name: "Wireless Headphones",
        sku: "WH-001",
        price: 79.99,
        stock: 45,
        category: "Electronics",
        description: "Premium wireless headphones with noise cancellation",
        images: ["/images/FlashSale1.jpg"],
        colors: ["Black", "Silver"],
        sizes: [],
        rating: 4.5,
        reviews: 128,
        status: "active",
      },
      {
        name: "Smart Watch",
        sku: "SW-002",
        price: 199.99,
        stock: 32,
        category: "Electronics",
        description: "Advanced smartwatch with fitness tracking",
        images: ["/images/FlashSale2.jpg"],
        colors: ["Black", "Gold"],
        sizes: [],
        rating: 4.7,
        reviews: 256,
        status: "active",
      },
      {
        name: "Running Shoes",
        sku: "RS-003",
        price: 89.99,
        stock: 28,
        category: "Sports",
        description: "Comfortable running shoes for all terrains",
        images: ["/images/FlashSale3.jpg"],
        colors: ["Black", "Blue", "Red"],
        sizes: ["6", "7", "8", "9", "10", "11", "12"],
        rating: 4.4,
        reviews: 89,
        status: "active",
      },
      {
        name: "Yoga Mat",
        sku: "YM-004",
        price: 29.99,
        stock: 56,
        category: "Sports",
        description: "Non-slip yoga mat for all yoga types",
        images: ["/images/FlashSale4.jpg"],
        colors: ["Purple", "Blue", "Green"],
        sizes: [],
        rating: 4.6,
        reviews: 145,
        status: "active",
      },
      {
        name: "Phone Case",
        sku: "PC-005",
        price: 19.99,
        stock: 5,
        category: "Accessories",
        description: "Durable phone case with impact protection",
        images: ["/images/FlashSale5.jpg"],
        colors: ["Black", "Clear", "Blue"],
        sizes: [],
        rating: 4.2,
        reviews: 312,
        status: "active",
      },
      {
        name: "USB-C Cable",
        sku: "UC-006",
        price: 12.99,
        stock: 120,
        category: "Accessories",
        description: "Fast charging USB-C cable",
        images: ["/images/FlashSale6.jpg"],
        colors: ["Black", "White"],
        sizes: [],
        rating: 4.3,
        reviews: 456,
        status: "active",
      },
      {
        name: "Backpack",
        sku: "BP-007",
        price: 49.99,
        stock: 38,
        category: "Accessories",
        description: "Water-resistant laptop backpack",
        images: ["/images/detail1.jpg"],
        colors: ["Black", "Gray"],
        sizes: [],
        rating: 4.5,
        reviews: 234,
        status: "active",
      },
      {
        name: "Bluetooth Speaker",
        sku: "BS-008",
        price: 59.99,
        stock: 67,
        category: "Electronics",
        description: "Portable Bluetooth speaker with 12hr battery",
        images: ["/images/detail2.jpg"],
        colors: ["Black", "Red", "Blue"],
        sizes: [],
        rating: 4.4,
        reviews: 178,
        status: "active",
      },
    ]);
    console.log("✅ Products created");

    // Create coupons
    await Coupon.insertMany([
      {
        code: "WELCOME10",
        discount: 10,
        discountType: "percentage",
        minOrderAmount: 50,
        maxUses: 100,
        usesCount: 0,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        active: true,
      },
      {
        code: "SAVE20",
        discount: 20,
        discountType: "fixed",
        minOrderAmount: 100,
        maxUses: 50,
        usesCount: 0,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        active: true,
      },
      {
        code: "SUMMER15",
        discount: 15,
        discountType: "percentage",
        minOrderAmount: 75,
        maxUses: 200,
        usesCount: 0,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        active: true,
      },
    ]);
    console.log("✅ Coupons created");

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
