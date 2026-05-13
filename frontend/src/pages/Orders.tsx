import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { orderAPI } from "../services/api";
import * as Types from "../types";
import "./styles/orders.css";

const formatStatus = (status: Types.Order["status"]) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const itemCount = (order: Types.Order) =>
  order.items.reduce((sum, item) => sum + item.quantity, 0);

const Orders = () => {
  const [orders, setOrders] = useState<Types.Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Types.Order["status"]>("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders({ limit: 50 });
      if (response.success) {
        setOrders(response.data);
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const pendingCount = orders.filter((order) =>
    ["pending", "processing", "shipped"].includes(order.status)
  ).length;

  const deliveredCount = orders.filter((order) => order.status === "delivered").length;

  const statusClass = (status: Types.Order["status"]) => {
    switch (status) {
      case "delivered":
        return "status-badge status-badge--success";
      case "shipped":
        return "status-badge status-badge--info";
      case "processing":
      case "pending":
        return "status-badge status-badge--warning";
      case "cancelled":
        return "status-badge status-badge--danger";
      default:
        return "status-badge";
    }
  };

  const handleCancelOrder = async (order: Types.Order) => {
    if (!order._id) return;

    const confirmed = window.confirm(`Cancel order ${order.orderId}?`);
    if (!confirmed) return;

    try {
      setCancellingId(order._id);
      setError("");
      setSuccess("");
      const response = await orderAPI.cancelOrder(order._id);
      if (response.success) {
        setOrders((current) =>
          current.map((item) => item._id === order._id ? response.data : item)
        );
        setSuccess("Order cancelled successfully");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setCancellingId("");
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

      {error && <div className="orders-alert orders-alert--error">{error}</div>}
      {success && <div className="orders-alert orders-alert--success">{success}</div>}

      <section className="orders-summary">
        <div className="orders-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="orders-card">
          <span>In Progress</span>
          <strong>{pendingCount}</strong>
        </div>
        <div className="orders-card">
          <span>Delivered</span>
          <strong>{deliveredCount}</strong>
        </div>
      </section>

      <div className="orders-toolbar">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | Types.Order["status"])}
          aria-label="Filter orders by status"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="orders-empty">Loading orders...</div>
      ) : filteredOrders.length ? (
        <div className="orders-table">
          <div className="orders-row orders-row--head">
            <div>Order ID</div>
            <div>Date</div>
            <div>Items</div>
            <div>Total</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {filteredOrders.map((order) => (
            <div key={order._id || order.orderId} className="orders-row">
              <div>
                <code>{order.orderId}</code>
              </div>
              <div>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</div>
              <div>{itemCount(order)}</div>
              <div>${order.total.toFixed(2)}</div>
              <div>
                <span className={statusClass(order.status)}>{formatStatus(order.status)}</span>
              </div>
              <div>
                {order.status === "pending" || order.status === "processing" ? (
                  <button
                    className="orders-cancel-btn"
                    onClick={() => handleCancelOrder(order)}
                    disabled={cancellingId === order._id}
                  >
                    {cancellingId === order._id ? "Cancelling..." : "Cancel"}
                  </button>
                ) : (
                  <span className="orders-muted">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="orders-empty">
          {orders.length ? "No orders match this filter." : "You have not placed any orders yet."}
        </div>
      )}
    </div>
  );
};

export default Orders;
