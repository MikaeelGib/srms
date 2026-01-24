import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { isAuthenticated, getUser } from "../utils/auth";

interface StudentRouteProps {
  children: ReactNode;
}

export default function StudentRoute({ children }: StudentRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  if (!user || user.role !== "student") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}