import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/wishlist.css";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import { wishlistAPI, cartAPI } from "../services/api";
import { useCartWishlist } from "../context/CartWishlistContext";
import * as Types from "../types";

const Wishlist = () => {
  const [items, setItems] = useState<Types.WishlistItem[]>([]);
  const { refreshCounts } = useCartWishlist();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      if (response.success) {
        setItems(response.data.items);
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await wishlistAPI.removeFromWishlist(productId);
      if (response.success) {
        setItems(response.data.items);
        await refreshCounts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove item");
    }
  };

  const moveToCart = async (productId: string) => {
    try {
      await cartAPI.addToCart(productId, 1);
      await removeFromWishlist(productId);
      await refreshCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not move item to cart");
    }
  };

  return (
    <div className="wishlist-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="bc-sep">/</span>
        <span className="bc-current">Wishlist</span>
      </nav>

      <div className="wishlist-header">
        <h1>Wishlist ({items.length})</h1>
      </div>

      {error && <div style={{ color: "#db4444", marginBottom: "20px" }}>{error}</div>}

      {loading ? (
        <div className="wishlist-empty">
          <p>Loading your wishlist...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty</p>
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="wishlist-container">
          <div className="wishlist-grid">
            {items.map((item) => {
              const product = typeof item.productId === "string" ? null : item.productId;
              const productId = typeof item.productId === "string" ? item.productId : item.productId._id || "";

              return (
                <div key={productId} className="wishlist-item">
                  <div className="item-image">
                    <img src={product?.images?.[0] || "/images/FlashSale1.jpg"} alt={product?.name || "Product"} />
                    {product && product.stock !== undefined && product.stock <= 0 && (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </div>
                  <div className="item-info">
                    <h3 className="item-name">{product?.name || "Unknown Product"}</h3>
                    <p className="item-price">${product?.price?.toFixed(2) ?? "0.00"}</p>
                    <div className="item-actions">
                      <button
                        className={`btn-add-cart ${product?.stock !== undefined && product.stock <= 0 ? "disabled" : ""}`}
                        onClick={() => moveToCart(productId)}
                        disabled={product?.stock !== undefined && product.stock <= 0}
                      >
                        <FiShoppingCart /> Add to Cart
                      </button>
                      <button
                        className="btn-remove"
                        onClick={() => removeFromWishlist(productId)}
                        title="Remove from wishlist"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;