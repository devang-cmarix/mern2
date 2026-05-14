# MERN E-Commerce Application

A full-stack MERN e-commerce application built with React, TypeScript, Express, and MongoDB. The project includes user authentication, product browsing, cart/wishlist management, checkout flow, admin dashboards, and order management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Seed Data](#seed-data)
- [Admin Access](#admin-access)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### User Features
- Signup and login with JWT authentication
- User profile view and update
- Password change flow
- Browse products with search and category filtering
- Shopping cart management
- Wishlist management
- Order creation, cancellation, and order history
- Coupon validation and discounts

### Admin Features
- Product CRUD operations
- Category CRUD operations
- Coupon management
- User management
- Order status updates
- Admin dashboard statistics
- Protected admin-only routes

## 🛠 Tech Stack

### Frontend
- React 19 with TypeScript
- Vite
- React Router DOM v7
- ESLint
- React Icons

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- CORS support
- tsx + nodemon for development

## 📁 Project Structure

```
mern2/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts

└── backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── app.ts
    │   ├── server.ts
    │   └── seed.ts
    ├── package.json
    ├── tsconfig.json
    └── .env.example
```

## 📦 Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- MongoDB installed and running

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=your_super_secret_jwt_key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Installation & Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your MongoDB URI and JWT secret.

### Frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env` with:

```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

## ▶️ Running the Application

### Development

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd frontend
npm run dev
```

The backend typically runs on `http://localhost:5000` and the frontend on `http://localhost:5173`.

### Seed the Database

Populate MongoDB with sample categories, products, and coupons:

```bash
cd backend
npm run seed
```

## 📦 Available Scripts

### Backend
- `npm run dev` — start backend with `nodemon` and `tsx`
- `npm run start` — alias for `dev`
- `npm run build` — compile backend TypeScript
- `npm run seed` — seed sample data into MongoDB

### Frontend
- `npm run dev` — start Vite development server
- `npm run build` — build production assets
- `npm run preview` — preview production build
- `npm run lint` — lint frontend code

## 🌐 API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/change-password`

### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users` (admin)
- `POST /api/users` (admin)
- `GET /api/users/:id` (admin)
- `PUT /api/users/:id` (admin)
- `DELETE /api/users/:id` (admin)

### Products
- `GET /api/products`
- `GET /api/products/search/:query`
- `GET /api/products/category/:category`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Categories
- `GET /api/categories`
- `GET /api/categories/:slug`
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

### Cart
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove/:productId`
- `DELETE /api/cart/clear`

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/admin/all` (admin)
- `GET /api/orders/:id`
- `PUT /api/orders/:id/status` (admin)
- `PUT /api/orders/:id/cancel`
- `DELETE /api/orders/:id` (admin)

### Wishlist
- `GET /api/wishlist`
- `POST /api/wishlist/add`
- `DELETE /api/wishlist/remove/:productId`
- `DELETE /api/wishlist/clear`

### Coupons
- `POST /api/coupons/validate`
- `GET /api/coupons` (admin)
- `POST /api/coupons` (admin)
- `PUT /api/coupons/:id` (admin)
- `DELETE /api/coupons/:id` (admin)

### Admin Dashboard
- `POST /api/admin/login`
- `GET /api/admin/dashboard` (admin)
- `GET /api/admin/orders/stats` (admin)
- `GET /api/admin/sales/stats` (admin)
- `GET /api/admin/products/stats` (admin)

## 🧪 Seed Data

The backend seed script inserts sample categories, products, and coupons.

Sample coupon codes:
- `WELCOME10` — 10% off (min order amount $50)
- `SAVE20` — $20 off (min order amount $100)
- `SUMMER15` — 15% off (min order amount $75)

## 🔐 Admin Access

To enable admin functionality, manually update a registered user in MongoDB by setting `role` to `admin`.

Example MongoDB shell command:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

## 🛠 Troubleshooting

- Confirm MongoDB is running and the `MONGODB_URI` is valid.
- Confirm frontend `VITE_API_URL` matches backend base URL.
- If ports conflict, update `PORT` in `backend/.env` or choose a different Vite port.
- Use browser/devtools console for network and CORS errors.

## 📘 Notes

This repository separates frontend and backend packages. Run `npm install` and `npm run dev` inside each folder independently.
