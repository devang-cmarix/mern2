import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/signup.css";
import shoppingImg from "/images/logon.jpg";
import { authAPI } from "../services/api";
import { useAuth } from "../components/Navbar/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
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
      const response = await authAPI.login(formData);
      if (response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user); // ✅ Now TypeScript knows it's definitely User, not undefined
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
        <h2>Log in to Exclusive</h2>
        <p className="subtitle">Enter your details below</p>

        {error && (
          <p style={{ color: "#db4444", marginBottom: "15px" }}>{error}</p>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
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
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="forgot-text">
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </p>
        </form>

        <p className="login-redirect">
          Don't have an account?{" "}
          <Link to="/signup" className="login-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
