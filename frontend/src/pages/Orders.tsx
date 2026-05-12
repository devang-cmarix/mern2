import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/orders.css";

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

const Orders = () => {
  const [orders] = useState<Order[]>([
    { id: "#ORD-1004", date: "2025-11-21", total: 189.99, status: "Delivered", items: 4 },
    { id: "#ORD-1009", date: "2025-12-03", total: 42.5, status: "Processing", items: 1 },
    { id: "#ORD-1012", date: "2025-12-11", total: 78.0, status: "Shipped", items: 2 },
    { id: "#ORD-1016", date: "2025-12-18", total: 230.75, status: "Cancelled", items: 6 },
  ]);

  const statusClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "status-badge status-badge--success";
      case "Shipped":
        return "status-badge status-badge--info";
      case "Processing":
        return "status-badge status-badge--warning";
      case "Cancelled":
        return "status-badge status-badge--danger";
      default:
        return "status-badge";
    }
  };

  return (
    <div className="orders-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="bc-sep">/</span>
        <span className="bc-current">My Orders</span>
      </nav>

      <header className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>Track current orders, review delivery status, and see recent purchases all in one place.</p>
        </div>
      </header>

      <section className="orders-summary">
        <div className="orders-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="orders-card">
          <span>Pending</span>
          <strong>{orders.filter((order) => order.status === "Processing" || order.status === "Shipped").length}</strong>
        </div>
        <div className="orders-card">
          <span>Delivered</span>
          <strong>{orders.filter((order) => order.status === "Delivered").length}</strong>
        </div>
      </section>

      <div className="orders-table">
        <div className="orders-row orders-row--head">
          <div>Order ID</div>
          <div>Date</div>
          <div>Items</div>
          <div>Total</div>
          <div>Status</div>
        </div>

        {orders.map((order) => (
          <div key={order.id} className="orders-row">
            <div>
              <code>{order.id}</code>
            </div>
            <div>{order.date}</div>
            <div>{order.items}</div>
            <div>${order.total.toFixed(2)}</div>
            <div>
              <span className={statusClass(order.status)}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
