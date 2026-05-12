import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./components/Navbar/AuthContext.tsx";
import { CartWishlistProvider } from "./context/CartWishlistContext.tsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.tsx";

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <CartWishlistProvider>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </CartWishlistProvider>
  </AuthProvider>
)
