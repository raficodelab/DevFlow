
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Loading DevFlow...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
