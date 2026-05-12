import { NavLink, Link } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import "./Navbar.css";
import UserDropdown from "../Userdropdown/Userdropdown";
import { useAuth } from "./AuthContext";
import { useCartWishlist } from "../../context/CartWishlistContext";

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const { cartCount, wishlistCount } = useCartWishlist();

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <p>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
          <span className="shop">ShopNow</span>
        </p>
        <div className="lang">English ▾</div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="logo">Exclusive</Link>

        {/* Nav links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>
              Products
            </NavLink>
          </li>

          {/* Show Sign Up only when NOT logged in */}
          {!isLoggedIn && (
            <li>
              <NavLink to="/signup" className={({ isActive }) => isActive ? "active" : ""}>
                Sign Up
              </NavLink>
            </li>
          )}
        </ul>

        {/* Right section */}
        <div className="right-section">
          {/* Search */}
          <div className="search-box">
            <input placeholder="What are you looking for?" />
            <FiSearch className="search-icon" />
          </div>

          {/* Show icons only when logged in */}
          {isLoggedIn && (
            <div className="iconDiv">
              {/* Wishlist */}
              <Link to="/wishlist" className="icon-btn cart">
                <span className="badge">{wishlistCount}</span>
                <FiHeart className="nav-icon" />
              </Link>

              {/* Cart */}
              <Link to="/cart" className="icon-btn cart">
                <span className="badge">{cartCount}</span>
                <FiShoppingCart className="nav-icon" />
              </Link>

              {/* User dropdown */}
              <UserDropdown />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
