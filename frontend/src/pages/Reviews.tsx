import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reviewAPI } from "../services/api";
import * as Types from "../types";
import "./styles/reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState<Types.Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await reviewAPI.getUserReviews();
        if (response.success) {
          setReviews(response.data);
          setError("");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="reviews-page">
        <div style={{ textAlign: "center", padding: "40px" }}>Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-page">
        <div style={{ textAlign: "center", padding: "40px", color: "#db4444" }}>{error}</div>
      </div>
    );
  }

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
          <span>Approved</span>
          <strong>{reviews.filter((review) => review.status === "approved").length}</strong>
        </div>
        <div className="review-card">
          <span>Pending</span>
          <strong>{reviews.filter((review) => review.status === "pending").length}</strong>
        </div>
      </section>

      <div className="reviews-list">
        {reviews.map((review) => {
          const product = typeof review.productId === "string" ? null : review.productId;
          const productName = product?.name || "Unknown Product";
          const productId = typeof review.productId === "string" ? review.productId : review.productId._id;

          return (
            <article key={review._id} className="review-item">
              <div className="review-top">
                <div>
                  <h3>{productName}</h3>
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
                <span>{new Date(review.createdAt || "").toLocaleDateString()}</span>
                <Link to={`/detail/${productId}`} className="review-link">View Product</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Reviews;
