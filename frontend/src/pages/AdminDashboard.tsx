import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import "./styles/adminDashboard.css";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

const AdminDashboard = () => {
  const [products] = useState<Product[]>([
    { id: 1, name: "Wireless Headphones", price: 79.99, stock: 45, category: "Electronics" },
    { id: 2, name: "Smart Watch", price: 199.99, stock: 32, category: "Electronics" },
    { id: 3, name: "Running Shoes", price: 89.99, stock: 28, category: "Sports" },
    { id: 4, name: "Yoga Mat", price: 29.99, stock: 56, category: "Sports" },
  ]);

  const stats = [
    { label: "Total Revenue", value: "$45,231.89", change: "+20.1%" },
    { label: "Total Orders", value: "2,847", change: "+15.3%" },
    { label: "Total Users", value: "12,458", change: "+8.2%" },
    { label: "Conversion Rate", value: "3.24%", change: "+2.1%" },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Welcome back, Admin!</p>
      </div>

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

      {/* Products Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Products</h2>
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

          {products.map((product) => (
            <div key={product.id} className="table-row">
              <div className="col-name">{product.name}</div>
              <div className="col-price">${product.price}</div>
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
          <h3>Top Category</h3>
          <p>Electronics</p>
        </div>
        <div className="stat-box">
          <h3>Low Stock Items</h3>
          <p>3 Products</p>
        </div>
        <div className="stat-box">
          <h3>Pending Orders</h3>
          <p>12 Orders</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
