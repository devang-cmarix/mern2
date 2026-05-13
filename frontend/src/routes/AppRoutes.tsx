import { BrowserRouter, Navigate, Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminPanel from "../components/AdminPanel";
import { ProtectedAdminRoute } from "../components/ProtectedAdminRoute";
import { ProtectedUserRoute } from "../components/ProtectedUserRoute";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import AdminLogin from "../pages/AdminLogin";
import NotFound from "../pages/NotFound";
import Account from "../pages/Account";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Orders from "../pages/Orders";
import Cancellations from "../pages/Cancellations";
import Reviews from "../pages/Reviews";
import DetailPage from "../pages/DetailPage";
import Checkout from "../pages/Checkout";
import Products from "../pages/Products";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminUsers from "../pages/AdminUsers";
import AdminOrders from "../pages/AdminOrders";
import AdminReviews from "../pages/AdminReviews";
import AdminSettings from "../pages/AdminSettings";

// Main layout wrapper
const MainLayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

// Admin layout wrapper
const AdminLayoutWrapper = () => (
  <AdminPanel>
    <Outlet />
  </AdminPanel>
);

// User Protected Routes Wrapper
const ProtectedUserRoutes = () => (
  <ProtectedUserRoute>
    <Outlet />
  </ProtectedUserRoute>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main App Routes with MainLayout */}
        <Route element={<MainLayoutWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/detail/:id" element={<DetailPage />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedUserRoutes />}>
            <Route path="/account" element={<Account />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cancellations" element={<Cancellations />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Routes with AdminPanel and Protection */}
        <Route
          element={
            <ProtectedAdminRoute>
              <AdminLayoutWrapper />
            </ProtectedAdminRoute>
          }
        >
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
