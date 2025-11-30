import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation()

  if (loading) return null;

  const isPublicRoute = ["/login", "/register"].includes(location.pathname);

  if (isPublicRoute && isAuthenticated) return <Navigate to="/" replace />;
  if (!isPublicRoute && !isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;