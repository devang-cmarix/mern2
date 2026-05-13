import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/checkout.css";
import { cartAPI, orderAPI } from "../services/api";
import { useCartWishlist } from "../context/CartWishlistContext";
import { useAuth } from "../components/Navbar/AuthContext";
import * as Types from "../types";

const Checkout = () => {
  const navigate = useNavigate();
  const { refreshCounts } = useCartWishlist();
  const { user } = useAuth();
  const [cart, setCart] = useState<Types.Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    companyName: "",
    streetAddress: user?.address || "",
    apartment: "",
    townCity: "",
    phoneNumber: user?.phone || "",
    emailAddress: user?.email || "",
    saveInfo: true,
  });

  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("cod");
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
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

    fetchCart();
  }, []);

  const subtotal = cart?.items.reduce((sum, item) => {
    const product = typeof item.productId === "string" ? null : item.productId;
    const price = product?.discountPrice || product?.price || 0;
    return sum + (price * item.quantity);
  }, 0) || 0;

  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    // Validate form
    if (!form.firstName || !form.streetAddress || !form.townCity || !form.phoneNumber || !form.emailAddress) {
      setError("Please fill in all required fields");
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData: Types.CreateOrderPayload = {
        billingDetails: {
          firstName: form.firstName,
          lastName: form.lastName || "",
          email: form.emailAddress,
          phone: form.phoneNumber,
          address: form.streetAddress,
          city: form.townCity,
          companyName: form.companyName,
          apartment: form.apartment,
        },
        paymentMethod,
        couponCode: coupon || undefined,
      };

      const response = await orderAPI.createOrder(orderData);
      if (response.success) {
        await refreshCounts(); // Refresh cart/wishlist counts
        navigate("/orders"); // Redirect to orders page
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="co-page">
        <div style={{ textAlign: "center", padding: "40px" }}>Loading checkout...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="co-page">
        {error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#db4444" }}>{error}</div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Your cart is empty. <a href="/products">Continue shopping</a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="co-page">

      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb">
        <a href="#">Account</a><span className="bc-sep">/</span>
        <a href="#">My Account</a><span className="bc-sep">/</span>
        <a href="#">Product</a><span className="bc-sep">/</span>
        <a href="#">View Cart</a><span className="bc-sep">/</span>
        <span className="bc-current">CheckOut</span>
      </nav>

      <div className="co-layout">

        {/* ── LEFT: Billing Details ── */}
        <div className="co-billing">
          <h1 className="co-title">Billing Details</h1>
          {error && <div className="co-error" role="alert">{error}</div>}

          <div className="co-fields">

            <div className="co-field">
              <label className="co-label">First Name<span className="req">*</span></label>
              <input className="co-input" type="text" name="firstName"
                value={form.firstName} onChange={handleChange} />
            </div>

            <div className="co-field">
              <label className="co-label">Company Name</label>
              <input className="co-input" type="text" name="companyName"
                value={form.companyName} onChange={handleChange} />
            </div>

            <div className="co-field">
              <label className="co-label">Street Address<span className="req">*</span></label>
              <input className="co-input" type="text" name="streetAddress"
                value={form.streetAddress} onChange={handleChange} />
            </div>

            <div className="co-field">
              <label className="co-label">Apartment, floor, etc. (optional)</label>
              <input className="co-input" type="text" name="apartment"
                value={form.apartment} onChange={handleChange} />
            </div>

            <div className="co-field">
              <label className="co-label">Town/City<span className="req">*</span></label>
              <input className="co-input" type="text" name="townCity"
                value={form.townCity} onChange={handleChange} />
            </div>

            <div className="co-field">
              <label className="co-label">Phone Number<span className="req">*</span></label>
              <input className="co-input" type="tel" name="phoneNumber"
                value={form.phoneNumber} onChange={handleChange} />
            </div>

            <div className="co-field">
              <label className="co-label">Email Address<span className="req">*</span></label>
              <input className="co-input" type="email" name="emailAddress"
                value={form.emailAddress} onChange={handleChange} />
            </div>

            <label className="co-save-info">
              <input
                type="checkbox"
                name="saveInfo"
                checked={form.saveInfo}
                onChange={handleChange}
                className="co-checkbox"
              />
              <span>Save this information for faster check-out next time</span>
            </label>

          </div>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div className="co-summary">

          {/* Order items */}
          <div className="co-items">
            {cart.items.map((item) => {
              const product = typeof item.productId === "string" ? null : item.productId;
              const price = product?.discountPrice || product?.price || 0;
              const subtotal = price * item.quantity;

              return (
                <div className="co-item" key={typeof item.productId === "string" ? item.productId : item.productId._id}>
                  <img src={product?.images?.[0] || "/images/placeholder.jpg"} alt={product?.name || "Product"} className="co-item-img" />
                  <span className="co-item-name">{product?.name || "Unknown Product"}</span>
                  <span className="co-item-price">${subtotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="co-totals">
            <div className="co-total-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <hr className="co-divider" />
            <div className="co-total-row">
              <span>Shipping:</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <hr className="co-divider" />
            <div className="co-total-row">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr className="co-divider" />
            <div className="co-total-row co-total-row--bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="co-payments">

            <label className="co-payment-option">
              <div className="co-radio-wrap">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="co-radio"
                />
                <span>Bank</span>
              </div>
              {/* Payment logos */}
              <div className="co-payment-logos">
                <img src="/images/payment1.jpg" alt="bKash" />
                <img src="/images/payment2.jpg" alt="Visa" />
                <img src="/images/payment3.jpg" alt="Mastercard" />
                <img src="/images/payment4.jpg" alt="Nagad" />
              </div>
            </label>

            <label className="co-payment-option">
              <div className="co-radio-wrap">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="co-radio"
                />
                <span>Cash on delivery</span>
              </div>
            </label>

          </div>

          {/* Coupon + Place Order */}
          <div className="co-coupon-row">
            <input
              className="co-coupon-input"
              type="text"
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button className="btn-apply">Apply Coupon</button>
          </div>

          <button className="btn-place-order" onClick={handlePlaceOrder} disabled={placingOrder}>
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
