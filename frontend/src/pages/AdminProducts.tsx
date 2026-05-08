import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDownload } from "react-icons/fi";
import "./styles/adminProducts.css";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive";
}

const AdminProducts = () => {
  const [products] = useState<Product[]>([
    { id: 1, name: "Wireless Headphones", sku: "WH-001", price: 79.99, stock: 45, category: "Electronics", status: "active" },
    { id: 2, name: "Smart Watch", sku: "SW-002", price: 199.99, stock: 32, category: "Electronics", status: "active" },
    { id: 3, name: "Running Shoes", sku: "RS-003", price: 89.99, stock: 28, category: "Sports", status: "active" },
    { id: 4, name: "Yoga Mat", sku: "YM-004", price: 29.99, stock: 56, category: "Sports", status: "active" },
    { id: 5, name: "Phone Case", sku: "PC-005", price: 19.99, stock: 5, category: "Accessories", status: "active" },
  ]);

  return (
    <div className="admin-products">
      <div className="page-header">
        <h1>Products Management</h1>
        <div className="header-actions">
          <button className="btn-secondary">
            <FiDownload /> Export
          </button>
          <button className="btn-primary">
            <FiPlus /> Add New Product
          </button>
        </div>
      </div>

      <div className="products-container">
        <div className="filters-bar">
          <div className="search-box-admin">
            <FiSearch />
            <input type="text" placeholder="Search products..." />
          </div>
          <select className="filter-select">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Sports</option>
            <option>Accessories</option>
          </select>
          <select className="filter-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="products-table">
          <div className="table-header">
            <div className="col-product">Product</div>
            <div className="col-sku">SKU</div>
            <div className="col-price">Price</div>
            <div className="col-stock">Stock</div>
            <div className="col-category">Category</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
          </div>

          {products.map((product) => (
            <div key={product.id} className="table-row">
              <div className="col-product">
                <div className="product-info">
                  <div className="product-img">
                    <div className="placeholder">IMG</div>
                  </div>
                  <div>
                    <p className="product-name">{product.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-sku">{product.sku}</div>
              <div className="col-price">${product.price}</div>
              <div className="col-stock">
                <span className={`stock-badge ${product.stock > 30 ? "in-stock" : product.stock > 10 ? "medium" : "low"}`}>
                  {product.stock}
                </span>
              </div>
              <div className="col-category">{product.category}</div>
              <div className="col-status">
                <span className={`status-badge ${product.status}`}>{product.status}</span>
              </div>
              <div className="col-actions">
                <button className="action-btn edit" title="Edit">
                  <FiEdit2 />
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

export default AdminProducts;
