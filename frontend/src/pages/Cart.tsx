import { useState } from "react";
import "./styles/cart.css";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const initialItems: CartItem[] = [
  { id: 1, name: "LCD Monitor", price: 650, image: "/images/FlashSale3.jpg", quantity: 1 },
  { id: 2, name: "H1 Gamepad", price: 550, image: "/images/FlashSale1.jpg", quantity: 2 },
];

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [coupon, setCoupon] = useState("");

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">

      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <span className="bc-sep">/</span>
        <span className="bc-current">Cart</span>
      </nav>

      {/* ── Cart table ── */}
      <div className="cart-table">

        {/* Header */}
        <div className="cart-header">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
        </div>

        {/* Rows */}
        {items.map((item) => (
          <div className="cart-row" key={item.id}>

            {/* Product */}
            <div className="cart-product">
              <button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="#db4444" />
                  <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <img src={item.image} alt={item.name} className="cart-img" />
              <span className="cart-name">{item.name}</span>
            </div>

            {/* Price */}
            <div className="cart-price">${item.price}</div>

            {/* Quantity spinner */}
            <div className="cart-qty">
              <div className="qty-box">
                <span className="qty-value">{item.quantity.toString().padStart(2, "0")}</span>
                <div className="qty-arrows">
                  <button onClick={() => updateQty(item.id, 1)} aria-label="Increase">
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                      <path d="M1 6l4-4 4 4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button onClick={() => updateQty(item.id, -1)} aria-label="Decrease">
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                      <path d="M1 1l4 4 4-4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Subtotal */}
            <div className="cart-subtotal">${item.price * item.quantity}</div>
          </div>
        ))}
      </div>

      {/* ── Table action buttons ── */}
      <div className="cart-actions">
        <a href="/shop" className="btn-outline">Return To Shop</a>
        <button className="btn-outline">Update Cart</button>
      </div>

      {/* ── Bottom section: coupon + cart total ── */}
      <div className="cart-bottom">

        {/* Coupon */}
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

        {/* Cart Total */}
        <div className="cart-total-box">
          <h3 className="total-title">Cart Total</h3>

          <div className="total-row">
            <span>Subtotal:</span>
            <span>${subtotal}</span>
          </div>
          <hr className="total-divider" />

          <div className="total-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <hr className="total-divider" />

          <div className="total-row total-row--bold">
            <span>Total:</span>
            <span>${subtotal}</span>
          </div>

          <button className="btn-checkout">Procees to checkout</button>
        </div>

      </div>
    </div>
  );
};

export default Cart;