import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiHome, FiPackage, FiUsers, FiBarChart2, FiSettings, FiLogOut, FiStar } from "react-icons/fi";
import { useAdminAuth } from "../../context/AdminAuthContext";
import "./AdminPanel.css";

interface AdminPanelProps {
  children: React.ReactNode;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin-login");
  };

  return (
    <div className="admin-container">
      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="admin-header">
          <h2 className="admin-logo">Admin</h2>
          <button 
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <FiHome className="nav-icon" />
            <span className={`nav-label ${!sidebarOpen ? "hidden" : ""}`}>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <FiPackage className="nav-icon" />
            <span className={`nav-label ${!sidebarOpen ? "hidden" : ""}`}>Products</span>
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <FiUsers className="nav-icon" />
            <span className={`nav-label ${!sidebarOpen ? "hidden" : ""}`}>Users</span>
          </NavLink>

          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <FiBarChart2 className="nav-icon" />
            <span className={`nav-label ${!sidebarOpen ? "hidden" : ""}`}>Orders</span>
          </NavLink>

          <NavLink
            to="/admin/reviews"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <FiStar className="nav-icon" />
            <span className={`nav-label ${!sidebarOpen ? "hidden" : ""}`}>Reviews</span>
          </NavLink>

          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <FiSettings className="nav-icon" />
            <span className={`nav-label ${!sidebarOpen ? "hidden" : ""}`}>Settings</span>
          </NavLink>
        </nav>

        <div className="admin-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
            <span className={`nav-label ${!sidebarOpen ? "hidden" : ""}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="admin-content">
        <div className="admin-topbar">
          <button 
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>
          <div className="admin-user">
            <span>Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </div>
        
        <div className="admin-main">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
