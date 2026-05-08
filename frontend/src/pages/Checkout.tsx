import { useState } from "react";
import "./styles/checkout.css";

const orderItems = [
  { id: 1, name: "LCD Monitor", price: 650, image: "/images/FlashSale1.jpg" },
  { id: 2, name: "H1 Gamepad", price: 1100, image: "/images/FlashSale3.jpg" },
];

const Checkout = () => {
  const [form, setForm] = useState({
    firstName: "",
    companyName: "",
    streetAddress: "",
    apartment: "",
    townCity: "",
    phoneNumber: "",
    emailAddress: "",
    saveInfo: true,
  });

  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("cod");
  const [coupon, setCoupon] = useState("");

  const subtotal = orderItems.reduce((s, i) => s + i.price, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

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
            {orderItems.map((item) => (
              <div className="co-item" key={item.id}>
                <img src={item.image} alt={item.name} className="co-item-img" />
                <span className="co-item-name">{item.name}</span>
                <span className="co-item-price">${item.price}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="co-totals">
            <div className="co-total-row">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <hr className="co-divider" />
            <div className="co-total-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <hr className="co-divider" />
            <div className="co-total-row co-total-row--bold">
              <span>Total:</span>
              <span>${subtotal}</span>
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

          <button className="btn-place-order">Place Order</button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;