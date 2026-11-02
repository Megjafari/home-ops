import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../lib/auth";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}