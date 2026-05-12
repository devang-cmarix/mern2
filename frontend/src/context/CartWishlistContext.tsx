import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { cartAPI, wishlistAPI } from "../services/api";
import { useAuth } from "../components/Navbar/AuthContext";

interface CartWishlistContextType {
  cartCount: number;
  wishlistCount: number;
  refreshCounts: () => Promise<void>;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCounts = async () => {
    if (!isLoggedIn) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    try {
      const [cartResponse, wishlistResponse] = await Promise.all([cartAPI.getCart(), wishlistAPI.getWishlist()]);
      if (cartResponse.success) {
        setCartCount(cartResponse.data.items.length);
      }
      if (wishlistResponse.success) {
        setWishlistCount(wishlistResponse.data.items.length);
      }
    } catch {
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    void refreshCounts();
  }, [isLoggedIn]);

  return (
    <CartWishlistContext.Provider value={{ cartCount, wishlistCount, refreshCounts }}>
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error("useCartWishlist must be used within CartWishlistProvider");
  }
  return context;
};
