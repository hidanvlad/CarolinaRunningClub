import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const isAuthenticated = () => localStorage.getItem('crc_auth') === 'true';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export default ProtectedRoute;
