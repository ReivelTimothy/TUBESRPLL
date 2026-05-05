import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props { allowedRoles?: string[] }

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth() as any;

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // If allowedRoles provided, check role from token/user
  if (allowedRoles) {
    const role = user?.role;
    if (!role || !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;