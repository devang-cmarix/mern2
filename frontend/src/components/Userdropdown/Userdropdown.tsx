import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiXCircle,
  FiStar,
  FiLogOut,
} from "react-icons/fi";
import "./Userdropdown.css";
import { useAuth } from "../Navbar/AuthContext";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);         // ✅ Clears context → Navbar updates instantly
    setOpen(false);        // ✅ Close dropdown
    navigate("/login");    // ✅ Redirect to login page
  };

  const menuItems = [
    { icon: <FiUser size={18} />, label: "Manage My Account", to: "/account" },
    { icon: <FiShoppingBag size={18} />, label: "My Order", to: "/orders" },
    { icon: <FiXCircle size={18} />, label: "My Cancellations", to: "/cancellations" },
    { icon: <FiStar size={18} />, label: "My Reviews", to: "/reviews" },
  ];

  return (
    <div className="ud-wrap" ref={ref}>
      {/* Trigger button */}
      <button
        className={`ud-trigger ${open ? "ud-trigger--active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
        aria-expanded={open}
      >
        <FiUser size={20} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="ud-dropdown">
          <ul className="ud-list">
            {/* Regular menu items */}
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="ud-item"
                  onClick={() => setOpen(false)}
                >
                  <span className="ud-item-icon">{item.icon}</span>
                  <span className="ud-item-label">{item.label}</span>
                </Link>
              </li>
            ))}

            {/* Logout — separate as a button, not a Link */}
            <li>
              <button
                className="ud-item ud-item--logout"
                onClick={handleLogout}
              >
                <span className="ud-item-icon">
                  <FiLogOut size={18} />
                </span>
                <span className="ud-item-label">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
