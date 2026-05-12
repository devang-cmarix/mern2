import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/reviews.css";

interface Review {
  id: string;
  product: string;
  date: string;
  rating: number;
  comment: string;
  status: string;
}

const Reviews = () => {
  const [reviews] = useState<Review[]>([
    { id: "RV-3001", product: "Noise-Cancelling Headphones", date: "2025-12-07", rating: 5, comment: "Amazing audio quality and very comfortable for long use.", status: "Published" },
    { id: "RV-3008", product: "Travel Smart Plug", date: "2025-12-13", rating: 4, comment: "Compact and works exactly as expected, perfect for travel.", status: "Published" },
    { id: "RV-3014", product: "Wireless Charging Stand", date: "2025-12-20", rating: 3, comment: "Good charger but heats up a bit when charging overnight.", status: "Pending" },
  ]);

  return (
    <div className="reviews-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="bc-sep">/</span>
        <span className="bc-current">My Reviews</span>
      </nav>

      <header className="reviews-header">
        <div>
          <h1>My Reviews</h1>
          <p>Manage your product feedback, see which reviews are published, and keep track of your latest ratings.</p>
        </div>
      </header>

      <section className="reviews-summary">
        <div className="review-card">
          <span>Total Reviews</span>
          <strong>{reviews.length}</strong>
        </div>
        <div className="review-card">
          <span>Published</span>
          <strong>{reviews.filter((review) => review.status === "Published").length}</strong>
        </div>
        <div className="review-card">
          <span>Pending</span>
          <strong>{reviews.filter((review) => review.status !== "Published").length}</strong>
        </div>
      </section>

      <div className="reviews-list">
        {reviews.map((review) => (
          <article key={review.id} className="review-item">
            <div className="review-top">
              <div>
                <h3>{review.product}</h3>
                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={index < review.rating ? "star star--active" : "star"}>&#9733;</span>
                  ))}
                </div>
              </div>
              <span className={`review-status review-status--${review.status.toLowerCase()}`}>{review.status}</span>
            </div>
            <p className="review-text">{review.comment}</p>
            <div className="review-footer">
              <span>{review.date}</span>
              <Link to="/detail" className="review-link">View Product</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
