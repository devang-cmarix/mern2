import { useState, useEffect } from "react";
import { FiEye, FiTrash2, FiSearch, FiDownload } from "react-icons/fi";
import "./styles/adminOrders.css";
import { orderAPI } from "../services/api";
import * as Types from "../types";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Types.Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getAllOrders();
        if (response.success) {
          setOrders(response.data);
          setError("");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="admin-orders">
      <div className="page-header">
        <h1>Orders Management</h1>
        <div className="header-actions">
          <button className="btn-secondary">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {error && <div style={{ color: "#db4444", marginBottom: "20px", padding: "12px", background: "#ffe0e0", borderRadius: "4px" }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#666" }}>Loading orders...</div>
      ) : (
        <div className="orders-container">
          <div className="filters-bar">
            <div className="search-box-admin">
              <FiSearch />
              <input type="text" placeholder="Search order ID or customer..." />
            </div>
            <select className="filter-select">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <select className="filter-select">
              <option>All Dates</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="orders-table">
            <div className="table-header">
              <div className="col-id">Order ID</div>
              <div className="col-customer">Customer</div>
              <div className="col-items">Items</div>
              <div className="col-amount">Amount</div>
              <div className="col-date">Date</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Actions</div>
            </div>

            {orders.map((order) => (
              <div key={order._id} className="table-row">
                <div className="col-id">
                  <code className="order-id">{order.orderId}</code>
                </div>
                <div className="col-customer">
                  {order.billingDetails.firstName} {order.billingDetails.lastName}
                </div>
                <div className="col-items">
                  <span className="items-badge">{order.items.length}</span>
                </div>
                <div className="col-amount">${order.total.toFixed(2)}</div>
                <div className="col-date">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</div>
                <div className="col-status">
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="col-actions">
                  <button className="action-btn view" title="View">
                    <FiEye />
                  </button>
                  <button className="action-btn delete" title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button className="page-btn">Previous</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
