import { useState, useEffect } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import "./styles/adminOrders.css";
import { orderAPI } from "../services/api";
import * as Types from "../types";
import { getAllowedTransitions, formatStatus,type OrderStatus } from "../utils/orderStatus";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Types.Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      case "delivered":  return "success";
      case "shipped":    return "info";
      case "processing": return "warning";
      case "pending":    return "warning";
      case "cancelled":  return "danger";
      default:           return "secondary";
    }
  };

  // ✅ Check if status is a final state (no more changes allowed)
  const isFinalStatus = (status: string) => {
    return status === "delivered" || status === "cancelled";
  };

  const handleStatusChange = async (
    orderId: string | undefined,
    status: Types.Order["status"]
  ) => {
    if (!orderId) return;

    try {
      setUpdatingOrderId(orderId);
      setError("");
      setSuccess("");
      const response = await orderAPI.updateOrderStatus(orderId, status);
      if (response.success) {
        setOrders((current) =>
          current.map((order) =>
            order._id === orderId ? response.data : order
          )
        );
        setSuccess(`Order marked as ${formatStatus(status as OrderStatus)}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId("");
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

      {error && <div className="admin-alert error">{error}</div>}
      {success && <div className="admin-alert success">{success}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#666" }}>
          Loading orders...
        </div>
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

            {orders.map((order) => {
              const allowedStatuses = getAllowedTransitions(order.status as OrderStatus);
              const isDisabled =
                updatingOrderId === order._id || isFinalStatus(order.status);

              return (
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
                  <div className="col-date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="col-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status as OrderStatus)}
                    </span>
                  </div>
                  <div className="col-actions">
                    {isFinalStatus(order.status) ? (
                      // ✅ Show a plain badge instead of select for final states
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status as OrderStatus)}
                      </span>
                    ) : (
                      <select
                        className="order-status-select"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value as Types.Order["status"]
                          )
                        }
                        disabled={isDisabled}
                        aria-label={`Update status for ${order.orderId}`}
                      >
                        {/* ✅ Only show allowed transitions */}
                        {allowedStatuses.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
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
