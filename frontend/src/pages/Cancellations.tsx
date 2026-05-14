import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderAPI } from "../services/api";
import type * as Types from "../types";
import "./styles/cancellations.css";

const formatDate = (value: string | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Cancellations = () => {
  const [cancellations, setCancellations] = useState<Types.Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCancellations = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getOrders({ status: "cancelled" });
        if (response.success) {
          setCancellations(response.data);
          setError("");
        } else {
          setError("Unable to load cancellations.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load cancellations.");
      } finally {
        setLoading(false);
      }
    };

    loadCancellations();
  }, []);

  const refundedCount = cancellations.filter((item) => item.status === "cancelled").length;
  const pendingCount = cancellations.filter((item) => item.status !== "cancelled").length;

  return (
    <div className="cancellations-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="bc-sep">/</span>
        <span className="bc-current">My Cancellations</span>
      </nav>

      <header className="cancellations-header">
        <div>
          <h1>My Cancellations</h1>
          <p>Review canceled orders, refund statuses, and a summary of each request.</p>
        </div>
      </header>

      <section className="cancellations-summary">
        <div className="cancel-card">
          <span>Total Cancellations</span>
          <strong>{cancellations.length}</strong>
        </div>
        <div className="cancel-card">
          <span>Cancelled</span>
          <strong>{refundedCount}</strong>
        </div>
        <div className="cancel-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>
      </section>

      {loading ? (
        <div className="cancel-list">
          <div className="cancel-empty">Loading cancellations...</div>
        </div>
      ) : error ? (
        <div className="cancel-list">
          <div className="cancel-empty">{error}</div>
        </div>
      ) : cancellations.length === 0 ? (
        <div className="cancel-list">
          <div className="cancel-empty">You have no cancelled orders yet.</div>
        </div>
      ) : (
        <div className="cancel-list">
          {cancellations.map((item) => (
            <article key={item._id} className="cancel-card-row">
              <div className="cancel-main">
                <div className="cancel-details">
                  <h3>{item.items.length > 1 ? `${item.items[0].productName} + ${item.items.length - 1} more` : item.items[0]?.productName || "Order Item"}</h3>
                  <p>{item.status === "cancelled" ? "Order was cancelled." : "Cancellation pending."}</p>
                </div>
                <div className="cancel-meta">
                  <span>{formatDate(item.createdAt)}</span>
                  <span>${item.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="cancel-status">
                <strong>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cancellations;
