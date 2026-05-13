import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Navbar/AuthContext";

interface ProtectedUserRouteProps {
  children: ReactNode;
}

export const ProtectedUserRoute = ({ children }: ProtectedUserRouteProps) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};