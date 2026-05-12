import { useRef } from "react";
import "./BestMonth.css";
import { FiHeart, FiEye } from "react-icons/fi";

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  rating: number;
  reviews: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "HAVIT HV-G92 Gamepad",
    price: 120,
    oldPrice: 160,
    discount: 40,
    image: "/images/FlashSale1.jpg",
    rating: 5,
    reviews: 88,
  },
  {
    id: 2,
    name: "AK-900 Wired Keyboard",
    price: 960,
    oldPrice: 1160,
    discount: 35,
    image: "/images/FlashSale2.jpg",
    rating: 4,
    reviews: 75,
  },
  {
    id: 3,
    name: "IPS LCD Gaming Monitor",
    price: 370,
    oldPrice: 400,
    discount: 30,
    image: "/images/FlashSale3.jpg",
    rating: 5,
    reviews: 99,
  },
  {
    id: 4,
    name: "S-Series Comfort Chair",
    price: 375,
    oldPrice: 400,
    discount: 25,
    image: "/images/FlashSale4.jpg",
    rating: 4,
    reviews: 99,
  },
  {
    id: 5,
    name: "S-Series Comfort Chair",
    price: 375,
    oldPrice: 400,
    discount: 25,
    image: "/images/FlashSale4.jpg",
    rating: 4,
    reviews: 99,
  },
];

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

const BestMonth = () => {
  const containerRef = useRef<HTMLDivElement>(null);


  return (
    <section className="flash">

      {/* ── HEADER ── */}
      <div className="flash-header">

        {/* Left: label + title + timer */}
        <div className="flash-left-group">
          <div className="today">
            <span className="bar" />
            <p>This Month</p>
          </div>

          <div className="flash-title-row">
            <h2>Best Selling Products</h2>
          </div>
        </div>

        {/* Right: arrows */}
      <div className="view-all-wrap">
        <button className="view-all-btn">View All</button>
      </div>

      </div>

      {/* ── PRODUCTS ── */}
      <div className="flash-products" ref={containerRef}>
        {products.map((p, i) => (
          <div key={`${p.id}-${i}`} className="card">


            <div className="icons">
              <button className="icon-btn" aria-label="Wishlist"><FiHeart size={16} /></button>
              <button className="icon-btn" aria-label="Quick view"><FiEye size={16} /></button>
            </div>

            {/* Image */}
            <div className="img-box">
              <img src={p.image} alt={p.name} />
              <div className="overlay">Add To Cart</div>
            </div>

            {/* Info */}
            <div className="card-body">
              <h4>{p.name}</h4>
              <div className="price">
                <span className="new">${p.price}</span>
                <span className="old">${p.oldPrice}</span>
              </div>
              <div className="rating">
                <StarRating rating={p.rating} />
                <span className="review-count">({p.reviews})</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};

export default BestMonth;
