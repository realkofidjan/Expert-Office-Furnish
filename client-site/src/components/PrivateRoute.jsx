import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileRequired from "../pages/ProfileRequired";

export default function PrivateRoute({
  children,
  adminOnly = false,
  showLoginPage = false,
}) {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If no user is logged in
  if (!user) {
    // For profile page, show a nice login required page
    if (showLoginPage) {
      return <ProfileRequired />;
    }
    // For other pages, redirect to login
    return <Navigate to="/login" />;
  }

  // If adminOnly is true, check for admin/staff role
  if (adminOnly && user.role !== "admin" && user.role !== "staff") {
    return <Navigate to="/not-authorized" />;
  }

  // For regular routes, any authenticated user can access
  return children;
}
