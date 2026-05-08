import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminPanel from "../components/AdminPanel";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Account from "../pages/Account";
import Cart from "../pages/Cart";
import DetailPage from "../pages/DetailPage";
import Checkout from "../pages/Checkout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminUsers from "../pages/AdminUsers";
import AdminOrders from "../pages/AdminOrders";
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

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main App Routes with MainLayout */}
        <Route element={<MainLayoutWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<NotFound />} />
          <Route path="/detail" element={<DetailPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Admin Routes with AdminPanel */}
        <Route element={<AdminLayoutWrapper />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;