import "./styles/signup.css";
import shoppingImg from "/images/logon.jpg";
import { Link } from "react-router";

export default function Signup() {
  return (
    <div className="signup-container">
      
      <div className="signup-left">
        <img src={shoppingImg} alt="shopping" />
      </div>

      {/* RIGHT FORM */}
      <div className="signup-right">
        <h2>Log in to Exclusive</h2>
        <p className="subtitle">Enter your details below</p>

        <form className="signup-form">
          <input type="text" placeholder="Email or Phone Number" />
          <input type="password" placeholder="Password" />

          <button className="primary-btn">Login</button>

          <p className="forgot-text">
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </p>
        </form>
      </div>

    </div>
  );
}