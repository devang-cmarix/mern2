import { useState } from "react";
import "./styles/account.css";

const MyAccount = () => {
  const userName = "Md Rimel";

  const [form, setForm] = useState({
    firstName: "Md",
    lastName: "Rimel",
    email: "rimel1111@gmail.com",
    address: "Kingston, 5236, United State",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setForm((f) => ({
      ...f,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Saved:", form);
  };

  return (
    <div className="account-page">

      {/* ── Top bar ── */}
      <div className="account-topbar">
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span className="bc-sep">/</span>
          <span className="bc-current">My Account</span>
        </nav>
        <p className="welcome-text">
          Welcome! <span className="welcome-name">{userName}</span>
        </p>
      </div>

      {/* ── Body ── */}
      <div className="account-body">

        {/* ── Sidebar ── */}
        <aside className="account-sidebar">
          <div className="sidebar-group">
            <h4 className="sidebar-heading">Manage My Account</h4>
            <ul className="sidebar-links">
              <li><a href="#" className="sidebar-link sidebar-link--active">My Profile</a></li>
              <li><a href="#" className="sidebar-link">Address Book</a></li>
              <li><a href="#" className="sidebar-link">My Payment Options</a></li>
            </ul>
          </div>

          <div className="sidebar-group">
            <h4 className="sidebar-heading">My Orders</h4>
            <ul className="sidebar-links">
              <li><a href="#" className="sidebar-link">My Returns</a></li>
              <li><a href="#" className="sidebar-link">My Cancellations</a></li>
            </ul>
          </div>

          <div className="sidebar-group">
            <h4 className="sidebar-heading">My WishList</h4>
          </div>
        </aside>

        {/* ── Main form panel ── */}
        <main className="account-main">
          <h2 className="form-title">Edit Your Profile</h2>

          {/* Name row */}
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">First Name</label>
              <input
                className="form-input"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Last Name</label>
              <input
                className="form-input"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
          </div>

          {/* Email + Address row */}
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Address</label>
              <input
                className="form-input"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>
          </div>

          {/* Password section */}
          <div className="form-section">
            <label className="form-label">Password Changes</label>
            <input
              className="form-input form-input--full"
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
            />
            <input
              className="form-input form-input--full"
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
            />
            <input
              className="form-input form-input--full"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save Changes</button>
          </div>
        </main>

      </div>
    </div>
  );
};

export default MyAccount;