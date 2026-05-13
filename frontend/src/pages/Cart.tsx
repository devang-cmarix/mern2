import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/cart.css";
import { cartAPI } from "../services/api";
import { useCartWishlist } from "../context/CartWishlistContext";
import * as Types from "../types";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Types.Cart | null>(null);
  const { refreshCounts } = useCartWishlist();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");

  const productIdFromItem = (item: Types.CartItem) =>
    typeof item.productId === "string" ? item.productId : item.productId._id || "";

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.success) {
        setCart(response.data);
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (item: Types.CartItem, delta: number) => {
    const productId = productIdFromItem(item);
    const quantity = Math.max(1, item.quantity + delta);

    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      if (response.success) {
        setCart(response.data);
        setError("");
        await refreshCounts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update quantity");
    }
  };

  const removeItem = async (item: Types.CartItem) => {
    const productId = productIdFromItem(item);

    try {
      const response = await cartAPI.removeFromCart(productId);
      if (response.success) {
        setCart(response.data);
        setError("");
        await refreshCounts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove item");
    }
  };

  const subtotal = cart?.total ??
    cart?.items.reduce((sum, item) => {
      const product = typeof item.productId === "string" ? null : item.productId;
      const price = product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0) ?? 0;

  return (
    <div className="cart-page">

      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <span className="bc-sep">/</span>
        <span className="bc-current">Cart</span>
      </nav>

      {error && <div style={{ color: "#db4444", marginBottom: "20px" }}>{error}</div>}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          Loading your cart...
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="cart-table">
          <div className="cart-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>
          <div className="cart-row" style={{ justifyContent: "center", padding: "40px" }}>
            <span>Your cart is empty.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="cart-table">
            <div className="cart-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </div>

            {cart.items.map((item) => {
              const product = typeof item.productId === "string" ? null : item.productId;
              const itemKey = product?._id || String(item.productId);
              const price = product?.price ?? 0;
              const image = product?.images?.[0] || "/images/FlashSale1.jpg";
              const name = product?.name || "Product";

              return (
                <div className="cart-row" key={itemKey}>
                  <div className="cart-product">
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item)}
                      aria-label="Remove item"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="11" fill="#db4444" />
                        <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                    <img src={image} alt={name} className="cart-img" />
                    <span className="cart-name">{name}</span>
                  </div>

                  <div className="cart-price">${price.toFixed(2)}</div>

                  <div className="cart-qty">
                    <div className="qty-box">
                      <span className="qty-value">{item.quantity.toString().padStart(2, "0")}</span>
                      <div className="qty-arrows">
                        <button onClick={() => updateQty(item, 1)} aria-label="Increase">
                          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                            <path d="M1 6l4-4 4 4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button onClick={() => updateQty(item, -1)} aria-label="Decrease">
                          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                            <path d="M1 1l4 4 4-4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="cart-subtotal">${(price * item.quantity).toFixed(2)}</div>
                </div>
              );
            })}
          </div>

          <div className="cart-actions">
            <Link to="/products" className="btn-outline">Return To Shop</Link>
            <button className="btn-outline" onClick={loadCart}>Refresh Cart</button>
          </div>

          <div className="cart-bottom">
            <div className="coupon-wrap">
              <input
                className="coupon-input"
                type="text"
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="btn-coupon">Apply Coupon</button>
            </div>

            <div className="cart-total-box">
              <h3 className="total-title">Cart Total</h3>

              <div className="total-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <hr className="total-divider" />

              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr className="total-divider" />

              <div className="total-row total-row--bold">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <button className="btn-checkout" onClick={() => navigate("/checkout")}>
                Proceed to checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
