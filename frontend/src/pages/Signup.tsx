import "./styles/signup.css";
import shoppingImg from "/images/logon.jpg"; // adjust path
import { FcGoogle } from 'react-icons/fc'; // Flat Color version
// import { FaGoogle } from 'react-icons/fa'; // Font Awesome version
import { Link } from "react-router";

export default function Signup() {
  return (
    <div className="signup-container">
      
      <div className="signup-left">
        <img src={shoppingImg} alt="shopping" />
      </div>

      {/* RIGHT FORM */}
      <div className="signup-right">
        <h2>Create an account</h2>
        <p className="subtitle">Enter your details below</p>

        <form className="signup-form">
          <input type="text" placeholder="Name" />
          <input type="text" placeholder="Email or Phone Number" />
          <input type="password" placeholder="Password" />

          <button className="primary-btn">Create Account</button>

          <button type="button" className="google-btn">
             <FcGoogle />
            Sign up with Google
          </button>

          <p className="login-text">
            Already have account? <Link to="/login" className="login-link">Login</Link>
          </p>
        </form>
      </div>

    </div>
  );
}