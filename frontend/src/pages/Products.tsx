import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiHeart, FiEye } from "react-icons/fi";
import { productAPI, cartAPI, wishlistAPI } from "../services/api";
import { useCartWishlist } from "../context/CartWishlistContext";
import { useAuth } from "../components/Navbar/AuthContext";
import * as Types from "../types";
import "./styles/products.css";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#FFAD33" : "none"}
          stroke={star <= rating ? "#FFAD33" : "#ccc"}
          strokeWidth="1.5"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const titleText = category ? `Category: ${category}` : "Explore Our Products";
  const { refreshCounts } = useCartWishlist();
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState<Types.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getProducts({ status: "active", category });
        if (response.success) {
          setProducts(response.data);
          setError("");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleAddToWishlist = async (productId: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setWishlistLoading(productId);
    try {
      await wishlistAPI.addToWishlist(productId);
      await refreshCounts();
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    } finally {
      setWishlistLoading(null);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setCartLoading(productId);
    try {
      await cartAPI.addToCart(productId, 1);
      await refreshCounts();
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setCartLoading(null);
    }
  };

  const handleQuickView = (productId: string) => {
    navigate(`/detail/${productId}`);
  };

  if (loading) {
    return (
      <section className="products-section">
        <div className="products-header">
          <div className="products-label">
            <span className="products-bar" />
            <span className="products-label-text">Our Products</span>
          </div>
          <h2 className="products-title">{titleText}</h2>
        </div>
        <div className="loading">Loading products...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <div className="products-header">
          <div className="products-label">
            <span className="products-bar" />
            <span className="products-label-text">Our Products</span>
          </div>
          <h2 className="products-title">{titleText}</h2>
        </div>
        <div className="error">{error}</div>
      </section>
    );
  }

  return (
    <section className="products-section">
      {/* ── HEADER ── */}
      <div className="products-header">
        <div className="products-label">
          <span className="products-bar" />
          <span className="products-label-text">Our Products</span>
        </div>
        <h2 className="products-title">
          {category ? `Category: ${category}` : "Explore Our Products"}
        </h2>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {/* Discount badge */}
            {product.discountPrice && (
              <span className="badge">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </span>
            )}

            {/* Wishlist + View icons */}
            <div className="icons">
              <button 
                className="icon-btn" 
                aria-label="Wishlist"
                onClick={() => handleAddToWishlist(product._id!)}
                disabled={wishlistLoading === product._id}
              >
                <FiHeart size={16} />
              </button>
              <button 
                className="icon-btn" 
                aria-label="Quick view"
                onClick={() => handleQuickView(product._id!)}
              >
                <FiEye size={16} />
              </button>
            </div>

            {/* Image */}
            <div className="img-box">
              <img
                src={product.images?.[0] || "/images/placeholder.jpg"}
                alt={product.name}
              />
              <div 
                className="overlay" 
                onClick={() => handleAddToCart(product._id!)}
                style={{ cursor: cartLoading === product._id ? 'not-allowed' : 'pointer' }}
              >
                {cartLoading === product._id ? "Adding..." : "Add To Cart"}
              </div>
            </div>

            {/* Info */}
            <div className="card-body">
              <h4>{product.name}</h4>
              <div className="price">
                <span className="new">
                  ${product.discountPrice ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                </span>
                {product.discountPrice && (
                  <span className="old">${product.price.toFixed(2)}</span>
                )}
              </div>
              <div className="rating">
                <StarRating rating={product.rating || 0} />
                <span className="review-count">({product.reviews || 0})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;