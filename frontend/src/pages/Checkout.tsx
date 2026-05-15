import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/checkout.css";
import { cartAPI, orderAPI, couponAPI } from "../services/api";
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
  const [appliedCoupon, setAppliedCoupon] = useState<Types.Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

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

  // Calculate coupon discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = (subtotal * appliedCoupon.discount) / 100;
    } else {
      discountAmount = appliedCoupon.discount;
    }
  }

  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const tax = subtotal * 0.08; // Tax on product-discounted subtotal, before coupon
  const total = subtotal - discountAmount + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      setCouponError("");
      setCouponSuccess("");
      const response = await couponAPI.validateCoupon(coupon.trim());
      if (response.success && response.data) {
        setAppliedCoupon(response.data);
        setCouponSuccess(`Coupon applied! Discount: ${response.data.discountType === "percentage" ? response.data.discount + "%" : "$" + response.data.discount}`);
        setCoupon("");
      }
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : "Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    setCouponError("");
    setCouponSuccess("");
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
        couponCode: appliedCoupon?.code || undefined,
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
            {discountAmount > 0 && (
              <>
                <div className="co-total-row" style={{ color: "#2ecc71" }}>
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <hr className="co-divider" />
              </>
            )}
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
          <div className="co-coupon-section">
            {appliedCoupon ? (
              <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f0fff4", border: "1px solid #2ecc71", borderRadius: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#2ecc71", fontWeight: "bold" }}>
                    ✓ Coupon Applied: {appliedCoupon.code}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#db4444",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="co-coupon-row">
                  <input
                    className="co-coupon-input"
                    type="text"
                    placeholder="Coupon Code"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setCouponError("");
                      setCouponSuccess("");
                    }}
                  />
                  <button
                    type="button"
                    className="btn-apply"
                    onClick={handleApplyCoupon}
                  >
                    Apply Coupon
                  </button>
                </div>
                {couponError && (
                  <div style={{ color: "#db4444", fontSize: "12px", marginTop: "5px" }}>
                    {couponError}
                  </div>
                )}
                {couponSuccess && (
                  <div style={{ color: "#2ecc71", fontSize: "12px", marginTop: "5px" }}>
                    {couponSuccess}
                  </div>
                )}
              </>
            )}
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
