import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/cancellations.css";

interface Cancellation {
  id: string;
  product: string;
  date: string;
  reason: string;
  amount: number;
  status: string;
}

const Cancellations = () => {
  const [cancellations] = useState<Cancellation[]>([
    { id: "#CAN-1021", product: "Wireless Earbuds", date: "2025-12-02", reason: "Delivery delay", amount: 59.99, status: "Refunded" },
    { id: "#CAN-1033", product: "Leather Backpack", date: "2025-12-09", reason: "Changed mind", amount: 120.0, status: "Processing" },
    { id: "#CAN-1045", product: "Smartwatch Pro", date: "2025-12-16", reason: "Found better price", amount: 199.95, status: "Refunded" },
  ]);

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
          <p>Review canceled orders, refund statuses, and reasons for each cancellation request.</p>
        </div>
      </header>

      <section className="cancellations-summary">
        <div className="cancel-card">
          <span>Total Cancellations</span>
          <strong>{cancellations.length}</strong>
        </div>
        <div className="cancel-card">
          <span>Refunded</span>
          <strong>{cancellations.filter((item) => item.status === "Refunded").length}</strong>
        </div>
        <div className="cancel-card">
          <span>Pending</span>
          <strong>{cancellations.filter((item) => item.status !== "Refunded").length}</strong>
        </div>
      </section>

      <div className="cancel-list">
        {cancellations.map((item) => (
          <article key={item.id} className="cancel-card-row">
            <div className="cancel-main">
              <div className="cancel-details">
                <h3>{item.product}</h3>
                <p>{item.reason}</p>
              </div>
              <div className="cancel-meta">
                <span>{item.date}</span>
                <span>${item.amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="cancel-status">
              <strong>{item.status}</strong>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Cancellations;
