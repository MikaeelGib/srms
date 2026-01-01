import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { isAuthenticated, isAdmin } from "../utils/auth";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
