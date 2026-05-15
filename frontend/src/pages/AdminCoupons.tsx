import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import "./styles/adminCoupons.css";
import { couponAPI } from "../services/api";
import * as Types from "../types";

type CouponForm = {
  code: string;
  discount: string;
  discountType: "percentage" | "fixed";
  minOrderAmount: string;
  maxUses: string;
  expiryDate: string;
  active: boolean;
};

const emptyCouponForm: CouponForm = {
  code: "",
  discount: "0",
  discountType: "percentage",
  minOrderAmount: "",
  maxUses: "",
  expiryDate: "",
  active: true,
};

const couponToForm = (coupon: Types.Coupon): CouponForm => ({
  code: coupon.code,
  discount: String(coupon.discount),
  discountType: coupon.discountType,
  minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount) : "",
  maxUses: coupon.maxUses ? String(coupon.maxUses) : "",
  expiryDate: coupon.expiryDate ? coupon.expiryDate.split("T")[0] : "",
  active: coupon.active,
});

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Types.Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Types.Coupon | null>(null);
  const [formData, setFormData] = useState<CouponForm>(emptyCouponForm);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponAPI.getCoupons({
        page,
        limit: 10,
      });

      if (response.success) {
        const allCoupons = response.data;
        
        // Filter by search if provided
        let filtered = allCoupons;
        if (search.trim()) {
          filtered = allCoupons.filter((c) =>
            c.code.toLowerCase().includes(search.toLowerCase())
          );
        }

        setCoupons(filtered);
        setTotalCoupons(filtered.length);
        setTotalPages(Math.max(1, Math.ceil(filtered.length / 10)));
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      fetchCoupons();
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData(emptyCouponForm);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (coupon: Types.Coupon) => {
    setEditingCoupon(coupon);
    setFormData(couponToForm(coupon));
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCoupon(null);
    setFormData(emptyCouponForm);
  };

  const updateForm = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      const checked = "checked" in event.target ? event.target.checked : false;
      setFormData((current) => ({ ...current, [name]: checked }));
    } else {
      setFormData((current) => ({ ...current, [name]: value }));
    }
  };

  const buildPayload = (): Omit<Types.Coupon, "_id" | "usesCount" | "createdAt"> => ({
    code: formData.code.trim().toUpperCase(),
    discount: Number(formData.discount),
    discountType: formData.discountType,
    minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : undefined,
    maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
    expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
    active: formData.active,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = buildPayload();

      if (!payload.code || Number.isNaN(payload.discount)) {
        throw new Error("Code and discount are required");
      }

      if (payload.discount <= 0) {
        throw new Error("Discount must be greater than 0");
      }

      if (editingCoupon?._id) {
        await couponAPI.updateCoupon(editingCoupon._id, payload);
        setSuccess("Coupon updated successfully");
      } else {
        await couponAPI.createCoupon(payload);
        setSuccess("Coupon created successfully");
      }

      closeModal();
      await fetchCoupons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (coupon: Types.Coupon) => {
    if (!coupon._id) return;

    const confirmed = window.confirm(`Delete coupon ${coupon.code}?`);
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      await couponAPI.deleteCoupon(coupon._id);
      setSuccess("Coupon deleted successfully");
      await fetchCoupons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete coupon");
    }
  };

  const displayCoupons = coupons.slice(
    (page - 1) * 10,
    page * 10
  );

  return (
    <div className="admin-coupons">
      {/* Page Header */}
      <div className="page-header">
        <h1>Coupons</h1>
        <p className="subtitle">Manage discount coupons</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={openCreateModal} className="btn-add">
          <FiPlus /> New Coupon
        </button>
      </div>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            Loading coupons...
          </div>
        ) : displayCoupons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            No coupons found. Create one to get started!
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Min Order</th>
                <th>Uses</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayCoupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>
                    <span className="coupon-code">{coupon.code}</span>
                  </td>
                  <td>
                    {coupon.discountType === "percentage"
                      ? `${coupon.discount}%`
                      : `$${coupon.discount.toFixed(2)}`}
                  </td>
                  <td>{coupon.discountType}</td>
                  <td>
                    {coupon.minOrderAmount
                      ? `$${coupon.minOrderAmount.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td>
                    {coupon.usesCount || 0}
                    {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                  </td>
                  <td>
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString()
                      : "No expiry"}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        coupon.active ? "active" : "inactive"
                      }`}
                    >
                      {coupon.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="btn-icon edit"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        className="btn-icon delete"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="pag-btn"
          >
            Previous
          </button>
          <span className="pag-info">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="pag-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</h2>
              <button onClick={closeModal} className="close-btn">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={updateForm}
                    placeholder="e.g., SAVE10"
                    disabled={!!editingCoupon}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Discount Amount *</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={updateForm}
                    placeholder="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type *</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={updateForm}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Min Order Amount</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={updateForm}
                    placeholder="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Uses</label>
                  <input
                    type="number"
                    name="maxUses"
                    value={formData.maxUses}
                    onChange={updateForm}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={updateForm}
                  />
                </div>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={updateForm}
                />
                <label htmlFor="active">Active</label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingCoupon
                      ? "Update Coupon"
                      : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
