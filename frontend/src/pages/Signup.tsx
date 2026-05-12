import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/signup.css";
import shoppingImg from "/images/logon.jpg";
import { FcGoogle } from "react-icons/fc";
import { authAPI } from "../services/api";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.signup(formData);
      if (response.token) {
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={shoppingImg} alt="shopping" />
      </div>

      <div className="signup-right">
        <h2>Create an account</h2>
        <p className="subtitle">Enter your details below</p>

        {error && <p style={{ color: "#db4444", marginBottom: "15px" }}>{error}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <button type="button" className="google-btn">
            <FcGoogle />
            Sign up with Google
          </button>

          <p className="login-text">
            Already have account?{" "}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
