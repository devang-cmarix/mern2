import { useEffect, useState, useRef } from "react";
import "./FlashSales.css";
import { FiHeart, FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

const FlashSales = () => {
  const [time, setTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = new Date().getTime() + 3 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 19 * 60 * 1000 + 56 * 1000;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      setTime(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(time);

  const scroll = (dir: "left" | "right") => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <section className="flash">

      {/* ── HEADER ── */}
      <div className="flash-header">

        {/* Left: label + title + timer */}
        <div className="flash-left-group">
          <div className="today">
            <span className="bar" />
            <p>Today's</p>
          </div>

          <div className="flash-title-row">
            <h2>Flash Sales</h2>

            <div className="flash-timer">
              <div className="time-box">
                <span className="time-label">Days</span>
                <p className="time-num">{days.toString().padStart(2, "0")}</p>
              </div>
              {/* Colon wrapped same as time-box: invisible label + colon as "number" */}
              <div className="time-box">
                <span className="time-label">&nbsp;</span>
                <p className="time-num dots">:</p>
              </div>
              <div className="time-box">
                <span className="time-label">Hours</span>
                <p className="time-num">{hours.toString().padStart(2, "0")}</p>
              </div>
              <div className="time-box">
                <span className="time-label">&nbsp;</span>
                <p className="time-num dots">:</p>
              </div>
              <div className="time-box">
                <span className="time-label">Minutes</span>
                <p className="time-num">{minutes.toString().padStart(2, "0")}</p>
              </div>
              <div className="time-box">
                <span className="time-label">&nbsp;</span>
                <p className="time-num dots">:</p>
              </div>
              <div className="time-box">
                <span className="time-label">Seconds</span>
                <p className="time-num">{seconds.toString().padStart(2, "0")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: arrows */}
        <div className="flash-arrows">
          <button onClick={() => scroll("left")} aria-label="Previous">
            <FiChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("right")} aria-label="Next">
            <FiChevronRight size={20} />
          </button>
        </div>

      </div>

      {/* ── PRODUCTS ── */}
      <div className="flash-products" ref={containerRef}>
        {products.map((p, i) => (
          <div key={`${p.id}-${i}`} className="card">

            {/* Discount badge */}
            <span className="badge">-{p.discount}%</span>

            {/* Wishlist + View icons */}
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

      {/* ── VIEW ALL BUTTON ── */}
      <div className="view-all-wrap">
        <button className="view-all-btn">View All Products</button>
      </div>

    </section>
  );
};

export default FlashSales;