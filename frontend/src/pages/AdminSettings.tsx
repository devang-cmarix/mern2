import { useState } from "react";
import { FiSave, FiCheck } from "react-icons/fi";
import "./styles/adminSettings.css";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "Exclusive Store",
    storeEmail: "admin@exclusive.com",
    storPhone: "+1-234-567-8900",
    address: "123 Main Street, New York, NY 10001",
    taxRate: 8.5,
    shippingCost: 5.99,
    freeShippingThreshold: 50,
    currency: "USD",
    language: "English",
    timezone: "Eastern",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === "taxRate" || name === "shippingCost" || name === "freeShippingThreshold"
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="subtitle">Manage your store settings</p>
      </div>

      <div className="settings-container">
        {/* Store Information */}
        <div className="settings-section">
          <h2>Store Information</h2>
          <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="storeName">Store Name</label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="storeEmail">Store Email</label>
              <input
                type="email"
                id="storeEmail"
                name="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="storPhone">Store Phone</label>
              <input
                type="tel"
                id="storPhone"
                name="storPhone"
                value={settings.storPhone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={settings.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Pricing & Shipping */}
        <div className="settings-section">
          <h2>Pricing & Shipping</h2>
          <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="taxRate">Tax Rate (%)</label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="shippingCost">Shipping Cost ($)</label>
              <input
                type="number"
                id="shippingCost"
                name="shippingCost"
                value={settings.shippingCost}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</label>
              <input
                type="number"
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Localization */}
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
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button className="btn-primary" onClick={handleSave}>
            <FiSave /> Save Settings
          </button>
          {saved && (
            <div className="save-success">
              <FiCheck /> Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
