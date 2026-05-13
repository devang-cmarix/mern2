import * as Types from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

const shouldUseAdminToken = (endpoint: string, method: string) => {
  const path = endpoint.split("?")[0];
  const normalizedMethod = method.toUpperCase();

  if (path.startsWith("/admin")) return true;
  if (path.startsWith("/orders/admin")) return true;
  if (/^\/orders\/[^/]+\/status$/.test(path)) return true;
  if (/^\/orders\/[^/]+$/.test(path) && normalizedMethod === "DELETE") return true;
  if (path === "/users" || (path !== "/users/profile" && /^\/users\/[^/]+$/.test(path))) return true;
  if (path.startsWith("/coupons") && path !== "/coupons/validate") return true;
  if (path === "/products" && normalizedMethod !== "GET") return true;
  if (/^\/products\/[^/]+$/.test(path) && ["PUT", "DELETE"].includes(normalizedMethod)) return true;
  if (path === "/categories" && normalizedMethod !== "GET") return true;
  if (/^\/categories\/[^/]+$/.test(path) && ["PUT", "DELETE"].includes(normalizedMethod)) return true;
  if (path.startsWith("/reviews/admin")) return true;
  if (/^\/reviews\/[^/]+\/status$/.test(path)) return true;

  return false;
};

// Helper to set auth token
const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

// Helper to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

// Helper to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const method = options.method || "GET";
  const token = shouldUseAdminToken(endpoint, method) ? getAdminToken() : getAuthToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// ============ AUTH ENDPOINTS ============

export const authAPI = {
  signup: async (payload: Types.SignupPayload) => {
    const response = await apiRequest<Types.AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  login: async (payload: Types.LoginPayload) => {
    const response = await apiRequest<Types.AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    return apiRequest<Types.AuthResponse>("/auth/me", {
      method: "GET",
    });
  },

  changePassword: async (payload: Types.ChangePasswordPayload) => {
    return apiRequest<Types.AuthResponse>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// ============ USER ENDPOINTS ============

export const userAPI = {
  getProfile: async () => {
    return apiRequest<{ success: boolean; data: Types.User }>("/users/profile", {
      method: "GET",
    });
  },

  updateProfile: async (payload: Types.UpdateProfilePayload) => {
    return apiRequest<{ success: boolean; data: Types.User }>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  getAllUsers: async (filters?: Types.PaginationParams) => {
    const queryString = new URLSearchParams(
      filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])) : []
    ).toString();
    return apiRequest<Types.UsersResponse>(`/users${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  getUserById: async (userId: string) => {
    return apiRequest<{ success: boolean; data: Types.User }>(`/users/${userId}`, {
      method: "GET",
    });
  },

  createUser: async (payload: Types.CreateUserPayload) => {
    return apiRequest<{ success: boolean; data: Types.User }>(`/users`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateUser: async (userId: string, payload: Types.UpdateUserPayload) => {
    return apiRequest<{ success: boolean; data: Types.User }>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteUser: async (userId: string) => {
    return apiRequest<{ success: boolean }>(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};

// ============ PRODUCT ENDPOINTS ============

export const productAPI = {
  getProducts: async (filters?: Types.ProductFilters) => {
    const queryString = new URLSearchParams(
      filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])) : []
    ).toString();
    return apiRequest<Types.ProductsResponse>(`/products${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  getProductById: async (productId: string) => {
    return apiRequest<Types.ProductResponse>(`/products/${productId}`, {
      method: "GET",
    });
  },

  getProductsByCategory: async (category: string, filters?: Types.PaginationParams) => {
    const queryString = new URLSearchParams(
      filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])) : []
    ).toString();
    return apiRequest<Types.ProductsResponse>(`/products/category/${category}${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  createProduct: async (payload: Types.Product) => {
    return apiRequest<Types.ProductResponse>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateProduct: async (productId: string, payload: Partial<Types.Product>) => {
    return apiRequest<Types.ProductResponse>(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteProduct: async (productId: string) => {
    return apiRequest<{ success: boolean }>(`/products/${productId}`, {
      method: "DELETE",
    });
  },

  searchProducts: async (query: string, filters?: Types.PaginationParams) => {
    const queryString = new URLSearchParams(
      filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])) : []
    ).toString();
    return apiRequest<Types.ProductsResponse>(`/products/search/${query}${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },
};

// ============ CART ENDPOINTS ============

export const cartAPI = {
  getCart: async () => {
    return apiRequest<Types.CartResponse>("/cart", {
      method: "GET",
    });
  },

  addToCart: async (productId: string, quantity: number, options?: { color?: string; size?: string }) => {
    return apiRequest<Types.CartResponse>("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, ...options }),
    });
  },

  updateCartItem: async (productId: string, quantity: number) => {
    return apiRequest<Types.CartResponse>(`/cart/update`, {
      method: "PUT",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  removeFromCart: async (productId: string) => {
    return apiRequest<Types.CartResponse>(`/cart/remove/${productId}`, {
      method: "DELETE",
    });
  },

  clearCart: async () => {
    return apiRequest<{ success: boolean }>("/cart/clear", {
      method: "DELETE",
    });
  },
};

// ============ ORDER ENDPOINTS ============

export const orderAPI = {
  createOrder: async (payload: Types.CreateOrderPayload) => {
    return apiRequest<Types.OrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getOrders: async (filters?: Types.PaginationParams) => {
    const queryString = new URLSearchParams(
      filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])) : []
    ).toString();
    return apiRequest<Types.OrdersResponse>(`/orders${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  getOrderById: async (orderId: string) => {
    return apiRequest<Types.OrderResponse>(`/orders/${orderId}`, {
      method: "GET",
    });
  },

  updateOrderStatus: async (orderId: string, status: Types.Order["status"]) => {
    return apiRequest<Types.OrderResponse>(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  cancelOrder: async (orderId: string) => {
    return apiRequest<Types.OrderResponse>(`/orders/${orderId}/cancel`, {
      method: "PUT",
    });
  },

  deleteOrder: async (orderId: string) => {
    return apiRequest<{ success: boolean }>(`/orders/${orderId}`, {
      method: "DELETE",
    });
  },

  getAllOrders: async (filters?: Types.PaginationParams) => {
    const queryString = new URLSearchParams(
      filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])) : []
    ).toString();
    return apiRequest<Types.OrdersResponse>(`/orders/admin/all${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },
};

// ============ WISHLIST ENDPOINTS ============

export const wishlistAPI = {
  getWishlist: async () => {
    return apiRequest<Types.WishlistResponse>("/wishlist", {
      method: "GET",
    });
  },

  addToWishlist: async (productId: string) => {
    return apiRequest<Types.WishlistResponse>("/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  removeFromWishlist: async (productId: string) => {
    return apiRequest<Types.WishlistResponse>(`/wishlist/remove/${productId}`, {
      method: "DELETE",
    });
  },

  clearWishlist: async () => {
    return apiRequest<{ success: boolean }>("/wishlist/clear", {
      method: "DELETE",
    });
  },
};

// ============ COUPON ENDPOINTS ============

export const couponAPI = {
  validateCoupon: async (code: string) => {
    return apiRequest<Types.CouponValidationResponse>("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  getCoupons: async (filters?: Types.PaginationParams) => {
    const queryString = new URLSearchParams(
      filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])) : []
    ).toString();
    return apiRequest<{ success: boolean; data: Types.Coupon[] }>(`/coupons${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  createCoupon: async (payload: Omit<Types.Coupon, "_id" | "createdAt">) => {
    return apiRequest<{ success: boolean; data: Types.Coupon }>("/coupons", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateCoupon: async (couponId: string, payload: Partial<Types.Coupon>) => {
    return apiRequest<{ success: boolean; data: Types.Coupon }>(`/coupons/${couponId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteCoupon: async (couponId: string) => {
    return apiRequest<{ success: boolean }>(`/coupons/${couponId}`, {
      method: "DELETE",
    });
  },
};

// ============ CATEGORY ENDPOINTS ============

export const categoryAPI = {
  getCategories: async () => {
    return apiRequest<Types.CategoriesResponse>("/categories", {
      method: "GET",
    });
  },

  getCategoryBySlug: async (slug: string) => {
    return apiRequest<{ success: boolean; data: Types.Category }>(`/categories/${slug}`, {
      method: "GET",
    });
  },
};

// ============ REVIEW ENDPOINTS ============

export const reviewAPI = {
  getReviews: async (filters?: Types.PaginationParams & { productId?: string; userId?: string; status?: string }) => {
    const queryString = new URLSearchParams(
      filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])) : []
    ).toString();
    return apiRequest<Types.ReviewsResponse>(`/reviews${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  getUserReviews: async (filters?: Types.PaginationParams) => {
    const queryString = new URLSearchParams(
      filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])) : []
    ).toString();
    return apiRequest<Types.ReviewsResponse>(`/reviews/user${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  createReview: async (payload: Types.CreateReviewPayload) => {
    return apiRequest<Types.ReviewResponse>("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateReview: async (reviewId: string, payload: Types.UpdateReviewPayload) => {
    return apiRequest<Types.ReviewResponse>(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteReview: async (reviewId: string) => {
    return apiRequest<{ success: boolean }>(`/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  adminDeleteReview: async (reviewId: string) => {
    return apiRequest<{ success: boolean }>(`/reviews/admin/${reviewId}`, {
      method: "DELETE",
    });
  },

  updateReviewStatus: async (reviewId: string, payload: Types.UpdateReviewStatusPayload) => {
    return apiRequest<Types.ReviewResponse>(`/reviews/${reviewId}/status`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

// ============ DASHBOARD ENDPOINTS ============

export const dashboardAPI = {
  getStats: async () => {
    return apiRequest<Types.DashboardResponse>("/admin/dashboard", {
      method: "GET",
    });
  },
};

export default {
  authAPI,
  userAPI,
  productAPI,
  cartAPI,
  orderAPI,
  wishlistAPI,
  couponAPI,
  categoryAPI,
  dashboardAPI,
  reviewAPI,
};
