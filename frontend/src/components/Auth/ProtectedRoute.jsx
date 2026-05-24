import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';

const ProtectedRoute = () => {
    const { currentUser } = useRuns();
    if (!currentUser) return <Navigate to="/login" replace />;
    return <Outlet />;
};

export default ProtectedRoute;
