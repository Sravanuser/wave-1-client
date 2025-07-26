import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ redirectTo = "/" }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null; // wait for auth state

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
