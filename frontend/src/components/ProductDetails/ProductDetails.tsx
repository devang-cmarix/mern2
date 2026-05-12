import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI, cartAPI, wishlistAPI } from "../../services/api";
import { useCartWishlist } from "../../context/CartWishlistContext";
import * as Types from "../../types";
import "./detsils.css";

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const navigate = useNavigate();
  const { refreshCounts } = useCartWishlist();
  const [product, setProduct] = useState<Types.Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [activeColour, setActiveColour] = useState(0);
  const [activeSize, setActiveSize] = useState("M");
  const [qty, setQty] = useState(2);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await productAPI.getProductById(productId);
        if (response.success) {
          setProduct(response.data);
          setError("");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product?._id) return;

    setCartLoading(true);
    try {
      await cartAPI.addToCart(product._id, qty);
      await refreshCounts();
      // Optionally navigate to cart or show success message
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product?._id) return;

    try {
      await wishlistAPI.addToWishlist(product._id);
      setWishlisted(true);
      await refreshCounts();
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div style={{ textAlign: "center", padding: "40px" }}>Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-page">
        <div style={{ textAlign: "center", padding: "40px", color: "#db4444" }}>
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  const images = product.images || ["/images/placeholder.jpg"];
  const colours = product.colors || [];
  const sizes = product.sizes || [];

  const price = product.discountPrice || product.price;

  return (
    <div className="pd-page">

      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb">
        <a href="#" onClick={() => navigate("/")}>Home</a>
        <span className="bc-sep">/</span>
        <a href="#" onClick={() => navigate("/products")}>Products</a>
        <span className="bc-sep">/</span>
        <span className="bc-current">{product.name}</span>
      </nav>

      {/* ── Main layout ── */}
      <div className="pd-layout">

        {/* ── Thumbnails ── */}
        <div className="pd-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              className={`pd-thumb ${i === activeImg ? "pd-thumb--active" : ""}`}
              onClick={() => setActiveImg(i)}
            >
              <img src={src} alt={`View ${i + 1}`} />
            </button>
          ))}
        </div>

        {/* ── Main image ── */}
        <div className="pd-main-img">
          <img src={images[activeImg]} alt="Product" />
        </div>

        {/* ── Product info ── */}
        <div className="pd-info">

          <h1 className="pd-title">{product.name}</h1>

          {/* Rating */}
          <div className="pd-rating">
            <div className="pd-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="16" height="16" viewBox="0 0 24 24"
                  fill={s <= (product.rating || 0) ? "#FFAD33" : "none"}
                  stroke={s <= (product.rating || 0) ? "#FFAD33" : "#ccc"}
                  strokeWidth="1.5">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
            </div>
            <span className="pd-reviews">({product.reviews || 0} Reviews)</span>
            <span className="pd-divider">|</span>
            <span className="pd-stock">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
          </div>

          {/* Price */}
          <p className="pd-price">${price.toFixed(2)}</p>

          {/* Description */}
          <p className="pd-desc">
            {product.description || "No description available."}
          </p>

          <hr className="pd-hr" />

          {/* Colours */}
          {colours.length > 0 && (
            <div className="pd-option-row">
              <span className="pd-option-label">Colours:</span>
              <div className="pd-colours">
                {colours.map((c, i) => (
                  <button
                    key={i}
                    className={`size-btn ${i === activeColour ? "size-btn--active" : ""}`}
                    onClick={() => setActiveColour(i)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div className="pd-option-row">
            <span className="pd-option-label">Size:</span>
            <div className="pd-sizes">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={`size-btn ${activeSize === s ? "size-btn--active" : ""}`}
                  onClick={() => setActiveSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Buy Now + Wishlist */}
          <div className="pd-actions">
            <div className="qty-control">
              <button
                className="qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
              >
                <svg width="14" height="14" viewBox="0 0 14 2" fill="none">
                  <path d="M1 1h12" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <span className="qty-value">{qty}</span>
              <button
                className="qty-btn qty-btn--plus"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <button 
              className="btn-buy" 
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              {cartLoading ? "Adding..." : "Buy Now"}
            </button>

            <button
              className={`btn-wish ${wishlisted ? "btn-wish--active" : ""}`}
              onClick={handleAddToWishlist}
              aria-label="Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? "#db4444" : "none"}
                stroke={wishlisted ? "#db4444" : "#1a1a1a"} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
                  a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                  1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Delivery info */}
          <div className="pd-delivery">

            <div className="delivery-row">
              <div className="delivery-icon">
                {/* Truck icon */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <path d="M16 8h4l3 5v3h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="1.5" />
                  <circle cx="18.5" cy="18.5" r="1.5" />
                </svg>
              </div>
              <div className="delivery-text">
                <strong>Free Delivery</strong>
                <a href="#" className="delivery-link">
                  Enter your postal code for Delivery Availability
                </a>
              </div>
            </div>

            <hr className="delivery-divider" />

            <div className="delivery-row">
              <div className="delivery-icon">
                {/* Return icon */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </div>
              <div className="delivery-text">
                <strong>Return Delivery</strong>
                <p>
                  Free 30 Days Delivery Returns.{" "}
                  <a href="#" className="delivery-link delivery-link--underline">Details</a>
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;