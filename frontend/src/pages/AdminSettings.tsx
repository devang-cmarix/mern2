import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { FiCheck, FiRefreshCw, FiSave } from "react-icons/fi";
import "./styles/adminSettings.css";

type StoreSettings = {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  address: string;
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
  currency: string;
  language: string;
  timezone: string;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
};

const SETTINGS_KEY = "adminStoreSettings";

const defaultSettings: StoreSettings = {
  storeName: "Exclusive Store",
  storeEmail: "admin@exclusive.com",
  storePhone: "+1-234-567-8900",
  address: "123 Main Street, New York, NY 10001",
  taxRate: 8.5,
  shippingCost: 5.99,
  freeShippingThreshold: 50,
  currency: "USD",
  language: "English",
  timezone: "Eastern",
  orderNotifications: true,
  lowStockAlerts: true,
};

const loadSettings = (): StoreSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return defaultSettings;

  try {
    return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {
    return defaultSettings;
  }
};

const AdminSettings = () => {
  const [settings, setSettings] = useState<StoreSettings>(loadSettings);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(loadSettings()));
  const [saved, setSaved] = useState(false);
  const [reset, setReset] = useState(false);

  const hasChanges = useMemo(() => {
    return JSON.stringify(settings) !== savedSnapshot;
  }, [settings, savedSnapshot]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const checked = "checked" in event.target ? event.target.checked : false;

    setSaved(false);
    setReset(false);
    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox"
        ? checked
        : ["taxRate", "shippingCost", "freeShippingThreshold"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextSnapshot = JSON.stringify(settings);
    localStorage.setItem(SETTINGS_KEY, nextSnapshot);
    setSavedSnapshot(nextSnapshot);
    setSaved(true);
    setReset(false);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const handleReset = () => {
    const nextSnapshot = JSON.stringify(defaultSettings);
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_KEY, nextSnapshot);
    setSavedSnapshot(nextSnapshot);
    setReset(true);
    setSaved(false);
    window.setTimeout(() => setReset(false), 2400);
  };

  return (
    <div className="admin-settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="subtitle">Manage your store settings</p>
      </div>

      <form className="settings-container" onSubmit={handleSave}>
        <div className="settings-summary">
          <div>
            <span className="summary-label">Store</span>
            <strong>{settings.storeName}</strong>
          </div>
          <div>
            <span className="summary-label">Currency</span>
            <strong>{settings.currency}</strong>
          </div>
          <div>
            <span className="summary-label">Shipping</span>
            <strong>{settings.shippingCost.toFixed(2)}</strong>
          </div>
        </div>

        <div className="settings-section">
          <h2>Store Information</h2>
          <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="storeName">Store Name</label>
              <input type="text" id="storeName" name="storeName" value={settings.storeName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="storeEmail">Store Email</label>
              <input type="email" id="storeEmail" name="storeEmail" value={settings.storeEmail} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="storePhone">Store Phone</label>
              <input type="tel" id="storePhone" name="storePhone" value={settings.storePhone} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" value={settings.address} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Pricing & Shipping</h2>
          <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="taxRate">Tax Rate (%)</label>
              <input type="number" id="taxRate" name="taxRate" value={settings.taxRate} onChange={handleChange} min="0" step="0.1" />
            </div>

            <div className="form-group">
              <label htmlFor="shippingCost">Shipping Cost</label>
              <input type="number" id="shippingCost" name="shippingCost" value={settings.shippingCost} onChange={handleChange} min="0" step="0.01" />
            </div>

            <div className="form-group">
              <label htmlFor="freeShippingThreshold">Free Shipping Threshold</label>
              <input type="number" id="freeShippingThreshold" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} min="0" step="0.01" />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Localization</h2>
          <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select id="currency" name="currency" value={settings.currency} onChange={handleChange}>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>CAD</option>
                <option>AUD</option>
                <option>INR</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select id="language" name="language" value={settings.language} onChange={handleChange}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Chinese</option>
                <option>Hindi</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <select id="timezone" name="timezone" value={settings.timezone} onChange={handleChange}>
                <option>Eastern</option>
                <option>Central</option>
                <option>Mountain</option>
                <option>Pacific</option>
                <option>UTC</option>
                <option>Asia/Kolkata</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="toggle-list">
            <label className="toggle-row">
              <span>
                <strong>Order notifications</strong>
                <small>Receive alerts when new orders are placed.</small>
              </span>
              <input type="checkbox" name="orderNotifications" checked={settings.orderNotifications} onChange={handleChange} />
            </label>
            <label className="toggle-row">
              <span>
                <strong>Low stock alerts</strong>
                <small>Highlight products that need inventory attention.</small>
              </span>
              <input type="checkbox" name="lowStockAlerts" checked={settings.lowStockAlerts} onChange={handleChange} />
            </label>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-primary" type="submit" disabled={!hasChanges}>
            <FiSave /> Save Settings
          </button>
          <button className="btn-secondary" type="button" onClick={handleReset}>
            <FiRefreshCw /> Reset
          </button>
          {saved && <div className="save-success"><FiCheck /> Settings saved successfully</div>}
          {reset && <div className="save-success"><FiCheck /> Defaults restored</div>}
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
