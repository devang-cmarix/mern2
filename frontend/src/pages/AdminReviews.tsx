import { useEffect, useState } from "react";
import { FiSearch, FiStar, FiTrash2 } from "react-icons/fi";
import { reviewAPI } from "../services/api";
import * as Types from "../types";
import "./styles/adminProducts.css";
import "./styles/adminReviews.css";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Types.Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getReviews({ limit: 50 });
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

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (review: Types.Review) => {
    if (!review._id) return;

    const product = typeof review.productId === "string" ? null : review.productId;
    const confirmed = window.confirm(`Delete review for ${product?.name || "this product"}?`);
    if (!confirmed) return;

    try {
      setDeletingId(review._id);
      setError("");
      setSuccess("");
      await reviewAPI.adminDeleteReview(review._id);
      setReviews((current) => current.filter((item) => item._id !== review._id));
      setSuccess("Review deleted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setDeletingId("");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const product = typeof review.productId === "string" ? null : review.productId;
    const user = typeof review.userId === "string" ? null : review.userId;
    const haystack = [
      product?.name,
      user?.firstName,
      user?.lastName,
      review.comment,
      review.status,
    ].join(" ").toLowerCase();

    return haystack.includes(search.trim().toLowerCase());
  });

  return (
    <div className="admin-reviews">
      <div className="page-header">
        <div>
          <h1>Reviews Management</h1>
          <p className="page-subtitle">{reviews.length} product reviews</p>
        </div>
      </div>

      {error && <div className="admin-alert error">{error}</div>}
      {success && <div className="admin-alert success">{success}</div>}

      <div className="reviews-container">
        <div className="filters-bar">
          <div className="search-box-admin">
            <FiSearch />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="admin-empty">Loading reviews...</div>
        ) : filteredReviews.length ? (
          <div className="reviews-admin-list">
            {filteredReviews.map((review) => {
              const product = typeof review.productId === "string" ? null : review.productId;
              const user = typeof review.userId === "string" ? null : review.userId;
              const userName = user ? `${user.firstName} ${user.lastName}`.trim() : "Customer";

              return (
                <article key={review._id} className="admin-review-item">
                  <div className="review-product">
                    <div className="review-product-img">
                      {product?.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <FiStar />}
                    </div>
                    <div>
                      <h3>{product?.name || "Unknown Product"}</h3>
                      <p>{userName}</p>
                    </div>
                  </div>

                  <div className="admin-review-body">
                    <div className="admin-review-stars">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} className={index < review.rating ? "active" : ""}>★</span>
                      ))}
                    </div>
                    <p>{review.comment}</p>
                    <span>{new Date(review.createdAt || "").toLocaleDateString()}</span>
                  </div>

                  <button
                    className="action-btn delete"
                    title="Delete review"
                    onClick={() => handleDelete(review)}
                    disabled={deletingId === review._id}
                  >
                    <FiTrash2 />
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty">No reviews found</div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
