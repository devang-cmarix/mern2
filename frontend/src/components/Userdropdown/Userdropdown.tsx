import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiXCircle,
  FiStar,
  FiLogOut,
} from "react-icons/fi";
import "./Userdropdown.css";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const menuItems = [
    { icon: <FiUser size={18} />, label: "Manage My Account", to: "/account" },
    { icon: <FiShoppingBag size={18} />, label: "My Order", to: "/orders" },
    { icon: <FiXCircle size={18} />, label: "My Cancellations", to: "/cancellations" },
    { icon: <FiStar size={18} />, label: "My Reviews", to: "/reviews" },
    { icon: <FiLogOut size={18} />, label: "Logout", to: "/logout" },
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
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;