# MERN E-Commerce Application

A complete, production-ready MERN (MongoDB, Express, React, Node.js) stack e-commerce application with full admin capabilities, user authentication, shopping cart, wishlist, and order management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Features Implemented](#features-implemented)

## ✨ Features

### User Features
- User authentication (Signup/Login)
- Profile management with password change
- Product browsing with filters
- Advanced product search
- Shopping cart management
- Wishlist functionality
- Order creation and tracking
- Order history
- Coupon/discount code application
- Multiple payment methods (COD, Bank Transfer)

### Admin Features
- Complete product management (CRUD)
- User management
- Order management with status updates
- Dashboard with analytics
- Sales and revenue tracking
- Inventory management
- Coupon code management
- Category management

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Styling**: CSS3
- **UI Components**: React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Built-in validation
- **CORS**: Enabled for cross-origin requests

## 📁 Project Structure

```
mern2/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # API service (api.ts)
│   │   ├── types/           # TypeScript types
│   │   ├── hooks/           # Custom hooks
│   │   ├── layouts/         # Layout components
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env
│
└── backend/
    ├── src/
    │   ├── config/          # Database configuration
    │   ├── models/          # MongoDB schemas
    │   ├── controllers/     # Request handlers
    │   ├── routes/          # API routes
    │   ├── middleware/      # Custom middleware
    │   ├── app.ts           # Express app setup
    │   ├── server.ts        # Server entry point
    │   └── seed.ts          # Database seeding
    ├── package.json
    ├── tsconfig.json
    ├── .env
    └── .env.example
```

## 📦 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
cd /path/to/mern2
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example and update)
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
# JWT_SECRET=your_secret_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 4. MongoDB Setup

```bash
# For Windows users, MongoDB is typically installed as a service
# For Mac/Linux, start MongoDB:
mongod

# Create database (MongoDB will create automatically)
# Or use MongoDB Compass GUI to connect to: mongodb://localhost:27017
```

## ▶️ Running the Application

### Development Mode

**Terminal 1: Start Backend Server**
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2: Start Frontend Development Server**
```bash
cd frontend
npm run dev
# Application will run on http://localhost:5173
```

**Terminal 3 (Optional): Seed Database**
```bash
cd backend
npx ts-node src/seed.ts
# This populates the database with sample products, categories, and coupons
```

### Production Mode

**Backend Build & Run**
```bash
cd backend
npm run build
npm start
```

**Frontend Build**
```bash
cd frontend
npm run build
npm run preview
```

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

### Product Endpoints
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search/:query` - Search products
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (admin)

### Wishlist Endpoints
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist
- `DELETE /api/wishlist/clear` - Clear wishlist

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Coupon Endpoints
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/coupons` - Get all coupons (admin)
- `POST /api/coupons` - Create coupon (admin)
- `PUT /api/coupons/:id` - Update coupon (admin)
- `DELETE /api/coupons/:id` - Delete coupon (admin)

### Admin Dashboard Endpoints
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/orders/stats` - Get order statistics
- `GET /api/admin/sales/stats` - Get sales statistics
- `GET /api/admin/products/stats` - Get product statistics

## 💾 Database Schema

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  passwordHash: String,
  phone: String,
  address: String,
  role: "user" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  sku: String (unique),
  price: Number,
  discountPrice: Number,
  stock: Number,
  category: String,
  description: String,
  images: [String],
  colors: [String],
  sizes: [String],
  rating: Number,
  reviews: Number,
  status: "active" | "inactive",
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  orderId: String (unique),
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  billingDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    companyName: String,
    apartment: String
  },
  total: Number,
  subtotal: Number,
  shipping: Number,
  tax: Number,
  couponCode: String,
  discount: Number,
  paymentMethod: "bank" | "cod",
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Schema
```javascript
{
  userId: ObjectId (ref: User, unique),
  items: [{
    productId: ObjectId,
    quantity: Number,
    selectedColor: String,
    selectedSize: String
  }],
  total: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Wishlist Schema
```javascript
{
  userId: ObjectId (ref: User, unique),
  items: [{
    productId: ObjectId
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Coupon Schema
```javascript
{
  code: String (unique),
  discount: Number,
  discountType: "percentage" | "fixed",
  minOrderAmount: Number,
  maxUses: Number,
  usesCount: Number,
  expiryDate: Date,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## ✅ Features Implemented

### Frontend Pages
- ✅ Home Page
- ✅ Product Details Page
- ✅ Cart Page
- ✅ Checkout Page
- ✅ Wishlist Page
- ✅ User Account Page
- ✅ Login & Signup
- ✅ Admin Dashboard
- ✅ Admin Products Management
- ✅ Admin Users Management
- ✅ Admin Orders Management
- ✅ Admin Settings

### Backend Functionality
- ✅ User Authentication & Authorization
- ✅ Product Catalog Management
- ✅ Shopping Cart System
- ✅ Order Management
- ✅ Wishlist System
- ✅ Coupon/Discount System
- ✅ Admin Statistics & Analytics
- ✅ JWT Token Management
- ✅ Password Hashing & Security
- ✅ Error Handling & Validation
- ✅ CORS Support
- ✅ Database Seeding

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Admin role-based access control
- CORS enabled for specified origins
- Environment variable configuration
- Input validation on all endpoints

## 📝 Additional Notes

- Make sure MongoDB is running before starting the backend
- Update environment variables for production deployment
- Change JWT_SECRET in production
- Implement proper error logging in production
- Set up proper CORS origins for production
- Consider using a reverse proxy (Nginx) for production
- Enable HTTPS for production deployment

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Coding! 🚀**
