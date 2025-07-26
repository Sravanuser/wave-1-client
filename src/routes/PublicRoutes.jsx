import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ redirectTo = "/studies" }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null; // or show a loader

    return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
}
