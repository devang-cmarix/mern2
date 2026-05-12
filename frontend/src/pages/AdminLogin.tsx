import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./styles/adminLogin.css";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLogin() {
  const { isAdminAuthenticated, loginAsAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || "/admin/dashboard";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginAsAdmin(password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAdminAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>Admin Access</h1>
          <p>Enter admin password to continue</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading || !password.trim()}
          >
            {loading ? "Authenticating..." : "Login as Admin"}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
