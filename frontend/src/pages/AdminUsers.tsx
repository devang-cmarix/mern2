import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDownload } from "react-icons/fi";
import "./styles/adminUsers.css";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive";
  orders: number;
}

const AdminUsers = () => {
  const [users] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 234 567 8900", joinDate: "2023-01-15", status: "active", orders: 5 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1 234 567 8901", joinDate: "2023-02-20", status: "active", orders: 12 },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1 234 567 8902", joinDate: "2023-03-10", status: "active", orders: 3 },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", phone: "+1 234 567 8903", joinDate: "2023-04-05", status: "inactive", orders: 0 },
    { id: 5, name: "Tom Brown", email: "tom@example.com", phone: "+1 234 567 8904", joinDate: "2023-05-12", status: "active", orders: 8 },
  ]);

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>Users Management</h1>
        <div className="header-actions">
          <button className="btn-secondary">
            <FiDownload /> Export
          </button>
          <button className="btn-primary">
            <FiPlus /> Add New User
          </button>
        </div>
      </div>

      <div className="users-container">
        <div className="filters-bar">
          <div className="search-box-admin">
            <FiSearch />
            <input type="text" placeholder="Search users by name or email..." />
          </div>
          <select className="filter-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="users-table">
          <div className="table-header">
            <div className="col-user">User</div>
            <div className="col-email">Email</div>
            <div className="col-phone">Phone</div>
            <div className="col-join">Join Date</div>
            <div className="col-orders">Orders</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
          </div>

          {users.map((user) => (
            <div key={user.id} className="table-row">
              <div className="col-user">
                <div className="user-info">
                  <div className="user-avatar">{user.name[0]}</div>
                  <span>{user.name}</span>
                </div>
              </div>
              <div className="col-email">{user.email}</div>
              <div className="col-phone">{user.phone}</div>
              <div className="col-join">{user.joinDate}</div>
              <div className="col-orders">
                <span className="order-badge">{user.orders}</span>
              </div>
              <div className="col-status">
                <span className={`status-badge ${user.status}`}>{user.status}</span>
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
          <button className="page-btn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
