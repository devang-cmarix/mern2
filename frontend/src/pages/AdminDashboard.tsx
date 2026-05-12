import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import "./styles/adminDashboard.css";
import { dashboardAPI } from "../services/api";
import * as Types from "../types";

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: Types.Order[];
  topProducts: Types.Product[];
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getStats();
        if (response.success) {
          setDashboardData(response.data);
          setError("");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = dashboardData
    ? [
        { label: "Total Revenue", value: `$${dashboardData.totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`, change: "+20.1%" },
        { label: "Total Orders", value: dashboardData.totalOrders.toLocaleString(), change: "+15.3%" },
        { label: "Total Users", value: dashboardData.totalUsers.toLocaleString(), change: "+8.2%" },
        { label: "Total Products", value: dashboardData.totalProducts.toLocaleString(), change: "+2.1%" },
      ]
    : [];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Welcome back, Admin!</p>
      </div>

      {error && <div style={{ color: "#db4444", marginBottom: "20px", padding: "12px", background: "#ffe0e0", borderRadius: "4px" }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#666" }}>Loading dashboard data...</div>
      ) : dashboardData ? (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-content">
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                  <span className="stat-change positive">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Top Products Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Top Products</h2>
              <button className="btn-primary">
                <FiPlus /> Add Product
              </button>
            </div>

            {/* Search & Filter */}
            <div className="search-filter">
              <div className="search-box-admin">
                <FiSearch />
                <input type="text" placeholder="Search products..." />
              </div>
            </div>

            {/* Table */}
            <div className="admin-table">
              <div className="table-header">
                <div className="col-name">Product Name</div>
                <div className="col-price">Price</div>
                <div className="col-stock">Stock</div>
                <div className="col-category">Category</div>
                <div className="col-actions">Actions</div>
              </div>

              {dashboardData.topProducts.map((product) => (
                <div key={product._id} className="table-row">
                  <div className="col-name">{product.name}</div>
                  <div className="col-price">${product.price.toFixed(2)}</div>
                  <div className="col-stock">
                    <span className={`stock-badge ${product.stock > 30 ? "in-stock" : "low-stock"}`}>
                      {product.stock}
                    </span>
                  </div>
                  <div className="col-category">{product.category}</div>
                  <div className="col-actions">
                    <button className="action-btn edit">
                      <FiEdit2 />
                    </button>
                    <button className="action-btn delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-box">
              <h3>Recent Orders</h3>
              <p>{dashboardData.recentOrders.length} Orders</p>
            </div>
            <div className="stat-box">
              <h3>Low Stock Items</h3>
              <p>{dashboardData.topProducts.filter((p) => p.stock < 30).length} Products</p>
            </div>
            <div className="stat-box">
              <h3>Pending Orders</h3>
              <p>{dashboardData.recentOrders.filter((o) => o.status === "processing").length} Orders</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
