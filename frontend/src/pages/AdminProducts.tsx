import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { FiDownload, FiEdit2, FiImage, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import "./styles/adminProducts.css";
import { productAPI } from "../services/api";
import * as Types from "../types";

type ProductForm = {
  name: string;
  sku: string;
  price: string;
  discountPrice: string;
  stock: string;
  category: string;
  description: string;
  images: (File | string)[];
  colors: string;
  sizes: string;
  status: "active" | "inactive";
};

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  price: "0",
  discountPrice: "0",
  stock: "0",
  category: "",
  description: "",
  images: [],
  colors: "",
  sizes: "",
  status: "active",
};

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const productToForm = (product: Types.Product): ProductForm => ({
  name: product.name,
  sku: product.sku,
  price: String(product.price),
  discountPrice: product.discountPrice ? String(product.discountPrice) : "0",
  stock: String(product.stock),
  category: product.category,
  description: product.description || "",
  images: product.images || [],
  colors: product.colors?.join(", ") || "",
  sizes: product.sizes?.join(", ") || "",
  status: product.status,
});

const AdminProducts = () => {
  const [products, setProducts] = useState<Types.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Types.Product | null>(null);
  const [formData, setFormData] = useState<ProductForm>(emptyForm);

  const categories = useMemo(() => {
    const names = products.map((product) => product.category).filter(Boolean);
    return Array.from(new Set(["Camera", "Gaming", "Headphone", "Laptop","Mobile","Watches", ...names]));
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts({
        page,
        limit: 8,
        search: search.trim() || undefined,
        category: category || undefined,
        status: status || undefined,
        sortBy,
      });

      if (response.success) {
        setProducts(response.data);
        setTotalProducts(response.total || response.data.length);
        setTotalPages(Math.max(1, Math.ceil((response.total || response.data.length) / (response.limit || 8))));
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, status, sortBy]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      fetchProducts();
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (product: Types.Product) => {
    setEditingProduct(product);
    setFormData(productToForm(product));
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  const updateForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const buildPayload = (): Types.Product => ({
    name: formData.name.trim(),
    sku: formData.sku.trim(),
    price: Number(formData.price),
    discountPrice: Number(formData.discountPrice) || undefined,
    stock: Number(formData.stock),
    category: formData.category.trim(),
    description: formData.description.trim(),
    images: formData.images.filter((img): img is string => typeof img === "string"),    
    colors: splitList(formData.colors),
    sizes: splitList(formData.sizes),
    status: formData.status,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = buildPayload();

      if (!payload.name || !payload.sku || !payload.category || Number.isNaN(payload.price)) {
        throw new Error("Name, SKU, category, and price are required");
      }

      if (editingProduct?._id) {
        await productAPI.updateProduct(editingProduct._id, payload);
        setSuccess("Product updated successfully");
      } else {
        await productAPI.createProduct(payload);
        setSuccess("Product created successfully");
      }

      closeModal();
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Types.Product) => {
    if (!product._id) return;

    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      await productAPI.deleteProduct(product._id);
      setSuccess("Product deleted successfully");
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const exportProducts = () => {
    const header = ["Name", "SKU", "Price", "Stock", "Category", "Status"];
    const rows = products.map((product) => [
      product.name,
      product.sku,
      product.price,
      product.stock,
      product.category,
      product.status,
    ]);
    const csv = [header, ...rows].map((row) => row.map(String).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-products">
      <div className="page-header">
        <div>
          <h1>Products Management</h1>
          <p className="page-subtitle">{totalProducts} products in catalog</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={exportProducts} disabled={!products.length}>
            <FiDownload /> Export
          </button>
          <button className="btn-primary" onClick={openCreateModal}>
            <FiPlus /> Add New Product
          </button>
        </div>
      </div>

      {error && <div className="admin-alert error">{error}</div>}
      {success && <div className="admin-alert success">{success}</div>}

      <div className="products-container">
        <div className="filters-bar">
          <div className="search-box-admin">
            <FiSearch />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select className="filter-select" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select className="filter-select" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select className="filter-select" value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-empty">Loading products...</div>
        ) : products.length ? (
          <>
            <div className="products-table">
              <div className="table-header">
                <div className="col-product">Product</div>
                <div className="col-sku">SKU</div>
                <div className="col-price">Price</div>
                <div className="col-discount">Discount</div>
                <div className="col-stock">Stock</div>
                <div className="col-category">Category</div>
                <div className="col-status">Status</div>
                <div className="col-actions">Actions</div>
              </div>

              {products.map((product) => (
                <div key={product._id} className="table-row">
                  <div className="col-product">
                    <div className="product-info">
                      <div className="product-img">
                        {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <FiImage />}
                      </div>
                      <div>
                        <p className="product-name">{product.name}</p>
                        <span className="product-desc">{product.description || "No description"}</span>
                        {product.colors?.length ? <p className="product-variants">Colors: {product.colors.join(", ")}</p> : null}
                      </div>
                    </div>
                  </div>
                  <div className="col-sku">{product.sku}</div>
                  <div className="col-price">${product.price.toFixed(2)}</div>
                  <div className="col-discount">
                    {product.discountPrice ? `$${product.discountPrice.toFixed(2)}` : "—"}
                  </div>
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
                    <button className="action-btn edit" title="Edit" onClick={() => openEditModal(product)}>
                      <FiEdit2 />
                    </button>
                    <button className="action-btn delete" title="Delete" onClick={() => handleDelete(product)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
                Previous
              </button>
              <span className="page-count">Page {page} of {totalPages}</span>
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="admin-empty">No products found</div>
        )}
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" role="presentation">
          <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
            <div className="admin-modal-header">
              <h2 id="product-modal-title">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close product form">
                <FiX />
              </button>
            </div>

            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Name
                  <input name="name" value={formData.name} onChange={updateForm} required />
                </label>
                <label>
                  SKU
                  <input name="sku" value={formData.sku} onChange={updateForm} required />
                </label>
                <label>
                  Price
                  <input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={updateForm} required />
                </label>
                <label>
                  Discount Price
                  <input name="discountPrice" type="number" min="0" step="0.01" value={formData.discountPrice} onChange={updateForm} />
                </label>
                <label>
                  Stock
                  <input name="stock" type="number" min="0" value={formData.stock} onChange={updateForm} required />
                </label>
                <label>
                  Category
                  <input name="category" value={formData.category} onChange={updateForm} list="category-options" required />
                  <datalist id="category-options">
                    {categories.map((item) => <option key={item} value={item} />)}
                  </datalist>
                </label>
                <label>
                  Status
                  <select name="status" value={formData.status} onChange={updateForm}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>

              <label>
                Description
                <textarea name="description" rows={3} value={formData.description} onChange={updateForm} />
              </label>
<label>
  Product Images

<input
  type="file"
  multiple
  accept="image/*"
  onChange={async (e) => {
    const files = e.target.files;

    if (!files) return;

    const imagePromises = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            resolve(reader.result as string);
          };

          reader.readAsDataURL(file);
        })
    );

    const images = await Promise.all(imagePromises);

    setFormData((current) => ({
      ...current,
      images: [...current.images, ...images],
    }));
  }}
/>

  {/* Preview Images */}
  <div className="image-preview">
    {formData.images.map((img, index) => (
      <img
        key={index}
        src={
          typeof img === "string"
            ? img
            : URL.createObjectURL(img)
        }
        alt="preview"
      />
    ))}
  </div>
</label>
              <div className="form-grid">
                <label>
                  Color Variants
                  <input name="colors" value={formData.colors} onChange={updateForm} placeholder="Black, White, Blue" />
                </label>
                <label>
                  Sizes
                  <input name="sizes" value={formData.sizes} onChange={updateForm} placeholder="S, M, L" />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
