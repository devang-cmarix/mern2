import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import "./styles/account.css";
import { authAPI, userAPI } from "../services/api";
import { useAuth } from "../components/Navbar/AuthContext";

type AccountForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const emptyForm: AccountForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const MyAccount = () => {
  const { user, setUser, isLoggedIn } = useAuth();
  const [form, setForm] = useState<AccountForm>(emptyForm);
  const [initialForm, setInitialForm] = useState<AccountForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hydrateForm = (profile: typeof user) => {
    if (!profile) return;

    const nextForm = {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    setForm(nextForm);
    setInitialForm(nextForm);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        if (response.success) {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          hydrateForm(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        hydrateForm(user);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setForm(initialForm);
    setError("");
    setSuccess("");
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const hasPasswordChange = form.currentPassword || form.newPassword || form.confirmPassword;

      const profileResponse = await userAPI.updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      if (profileResponse.success) {
        setUser(profileResponse.data);
        localStorage.setItem("user", JSON.stringify(profileResponse.data));
      }

      if (hasPasswordChange) {
        await authAPI.changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        });
      }

      const nextForm = {
        firstName: profileResponse.data.firstName || "",
        lastName: profileResponse.data.lastName || "",
        email: profileResponse.data.email || "",
        phone: profileResponse.data.phone || "",
        address: profileResponse.data.address || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };

      setForm(nextForm);
      setInitialForm(nextForm);
      setSuccess(hasPasswordChange ? "Profile and password updated" : "Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const userName = `${form.firstName} ${form.lastName}`.trim() || "Customer";

  return (
    <div className="account-page">
      <div className="account-topbar">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="bc-sep">/</span>
          <span className="bc-current">My Account</span>
        </nav>
        <p className="welcome-text">
          Welcome! <span className="welcome-name">{userName}</span>
        </p>
      </div>

      <div className="account-body">
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
              <li><Link to="/orders" className="sidebar-link">My Orders</Link></li>
              <li><Link to="/cancellations" className="sidebar-link">My Cancellations</Link></li>
            </ul>
          </div>

          <div className="sidebar-group">
            <h4 className="sidebar-heading">My WishList</h4>
            <ul className="sidebar-links">
              <li><Link to="/wishlist" className="sidebar-link">Saved Items</Link></li>
            </ul>
          </div>
        </aside>

        <main className="account-main">
          <h2 className="form-title">Edit Your Profile</h2>

          {loading ? (
            <div className="account-message">Loading profile...</div>
          ) : (
            <form className="account-form" onSubmit={handleSave}>
              {error && <div className="account-alert error">{error}</div>}
              {success && <div className="account-alert success">{success}</div>}

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">First Name</label>
                  <input className="form-input" type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Address</label>
                <input className="form-input" type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" />
              </div>

              <div className="form-section">
                <label className="form-label">Password Changes</label>
                <input className="form-input form-input--full" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Current Password" />
                <input className="form-input form-input--full" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="New Password" />
                <input className="form-input form-input--full" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm New Password" />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel} disabled={saving}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyAccount;
