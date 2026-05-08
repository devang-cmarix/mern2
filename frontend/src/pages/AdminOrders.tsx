import { useState } from "react";
import { FiEye, FiTrash2, FiSearch, FiDownload } from "react-icons/fi";
import "./styles/adminOrders.css";

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
}

const AdminOrders = () => {
  const [orders] = useState<Order[]>([
    { id: "ORD-001", customer: "John Doe", amount: 249.99, status: "delivered", date: "2024-01-15", items: 3 },
    { id: "ORD-002", customer: "Jane Smith", amount: 189.50, status: "shipped", date: "2024-01-16", items: 2 },
    { id: "ORD-003", customer: "Mike Johnson", amount: 399.00, status: "processing", date: "2024-01-17", items: 5 },
    { id: "ORD-004", customer: "Sarah Williams", amount: 99.99, status: "pending", date: "2024-01-18", items: 1 },
    { id: "ORD-005", customer: "Tom Brown", amount: 549.75, status: "delivered", date: "2024-01-19", items: 4 },
  ]);

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
            <div key={order.id} className="table-row">
              <div className="col-id">
                <code className="order-id">{order.id}</code>
              </div>
              <div className="col-customer">{order.customer}</div>
              <div className="col-items">
                <span className="items-badge">{order.items}</span>
              </div>
              <div className="col-amount">${order.amount.toFixed(2)}</div>
              <div className="col-date">{order.date}</div>
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
    </div>
  );
};

export default AdminOrders;
