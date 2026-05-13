// User Types
export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  total?: number;
  page?: number;
  limit?: number;
}

// Product Types
export interface Product {
  _id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductFilters {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

// Cart Types
export interface CartItem {
  productId: string | Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
}

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id?: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  billingDetails: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    companyName?: string;
    apartment?: string;
  };
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  couponCode?: string;
  discount?: number;
  paymentMethod: "bank" | "cod";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  total?: number;
}

export interface CreateOrderPayload {
  billingDetails: Order["billingDetails"];
  paymentMethod: "bank" | "cod";
  couponCode?: string;
}

// Wishlist Types
export interface WishlistItem {
  productId: string | Product;
}

export interface Wishlist {
  _id?: string;
  userId: string;
  items: WishlistItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistResponse {
  success: boolean;
  data: Wishlist;
}

// Category Types
export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

// Coupon Types
export interface Coupon {
  _id?: string;
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minOrderAmount?: number;
  maxUses?: number;
  usesCount?: number;
  expiryDate?: string;
  active: boolean;
  createdAt?: string;
}

export interface CouponValidationResponse {
  success: boolean;
  data?: Coupon;
  message?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: Product[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}

// Review Types
export interface Review {
  _id?: string;
  userId: string | User;
  productId: string | Product;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface UpdateReviewStatusPayload {
  status: "pending" | "approved" | "rejected";
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
