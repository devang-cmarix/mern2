import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  loginAsAdmin: (password: string) => Promise<void>;
  logoutAdmin: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem("adminToken"));
  });

  useEffect(() => {
    // Check if admin token exists in localStorage on mount
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const loginAsAdmin = async (password: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Admin login failed");
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      setIsAdminAuthenticated(true);
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, loginAsAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
};
