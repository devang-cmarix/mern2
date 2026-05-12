import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDownload, FiX } from "react-icons/fi";
import "./styles/adminUsers.css";
import { userAPI } from "../services/api";
import * as Types from "../types";

type UserForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

const emptyForm: UserForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

const AdminUsers = () => {
  const [users, setUsers] = useState<Types.User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Types.User | null>(null);
  const [formData, setFormData] = useState<UserForm>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      if (response.success) {
        setUsers(response.data);
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (user: Types.User) => {
    if (user.role === "admin") {
      setError("Admin users cannot be edited from this screen.");
      return;
    }

    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      password: "",
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setFormData(emptyForm);
  };

  const updateForm = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const buildPayload = (): Types.CreateUserPayload | Types.UpdateUserPayload => {
    const payload: Types.UpdateUserPayload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      password: formData.password.trim() || undefined,
    };

    if (!editingUser) {
      return {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        password: payload.password || "password123",
      };
    }

    return payload;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = buildPayload();

      if (!payload.firstName || !payload.lastName || !payload.email) {
        throw new Error("First name, last name and email are required.");
      }

      if (editingUser && editingUser._id) {
        await userAPI.updateUser(editingUser._id, payload);
        setSuccess("User updated successfully.");
      } else {
        await userAPI.createUser(payload as Types.CreateUserPayload);
        setSuccess("User created successfully.");
      }

      closeModal();
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: Types.User) => {
    if (user.role === "admin") {
      setError("Admin users cannot be deleted.");
      return;
    }

    if (!user._id) return;

    if (!window.confirm(`Delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await userAPI.deleteUser(user._id);
      setSuccess("User deleted successfully.");
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    return (
      !query ||
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>Users Management</h1>
        <div className="header-actions">
          <button className="btn-secondary">
            <FiDownload /> Export
          </button>
          <button className="btn-primary" onClick={openCreateModal}>
            <FiPlus /> Add New User
          </button>
        </div>
      </div>

      {error && <div style={{ color: "#db4444", marginBottom: "20px", padding: "12px", background: "#ffe0e0", borderRadius: "4px" }}>{error}</div>}
      {success && <div style={{ color: "#1a7f37", marginBottom: "20px", padding: "12px", background: "#e8f6ec", borderRadius: "4px" }}>{success}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#666" }}>Loading users...</div>
      ) : (
        <div className="users-container">
          <div className="filters-bar">
            <div className="search-box-admin">
              <FiSearch />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="users-table">
            <div className="table-header">
              <div className="col-user">User</div>
              <div className="col-email">Email</div>
              <div className="col-phone">Phone</div>
              <div className="col-join">Join Date</div>
              <div className="col-status">Role</div>
              <div className="col-actions">Actions</div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="table-row empty-row">No users found.</div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="table-row">
                  <div className="col-user">
                    <div className="user-info">
                      <div className="user-avatar">{user.firstName[0]}</div>
                      <span>{user.firstName} {user.lastName}</span>
                    </div>
                  </div>
                  <div className="col-email">{user.email}</div>
                  <div className="col-phone">{user.phone || "N/A"}</div>
                  <div className="col-join">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</div>
                  <div className="col-status">
                    <span className={`status-badge ${user.role}`}>{user.role}</span>
                  </div>
                  <div className="col-actions">
                    <button
                      className="action-btn edit"
                      title="Edit"
                      onClick={() => openEditModal(user)}
                      disabled={user.role === "admin"}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete"
                      onClick={() => handleDelete(user)}
                      disabled={user.role === "admin"}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pagination">
            <button className="page-btn" disabled>
              Previous
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn" disabled>
              Next
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-backdrop" role="presentation">
          <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
            <div className="admin-modal-header">
              <h2 id="user-modal-title">{editingUser ? "Edit User" : "Add New User"}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close user form">
                <FiX />
              </button>
            </div>

            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  First Name
                  <input name="firstName" value={formData.firstName} onChange={updateForm} required />
                </label>
                <label>
                  Last Name
                  <input name="lastName" value={formData.lastName} onChange={updateForm} required />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={formData.email} onChange={updateForm} required />
                </label>
                <label>
                  Phone
                  <input name="phone" value={formData.phone} onChange={updateForm} />
                </label>
                <label>
                  Password
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={updateForm}
                    placeholder={editingUser ? "Leave blank to keep existing password" : "Create a password"}
                    {...(!editingUser ? { required: true } : {})}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
