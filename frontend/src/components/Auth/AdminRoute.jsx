import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRuns } from '../../context/RunsContext';

const AdminRoute = () => {
    const { currentUser } = useRuns();
    if (!currentUser) return <Navigate to="/login" replace />;
    if (currentUser.role !== 'Admin') return <Navigate to="/dashboard" replace />;
    return <Outlet />;
};

export default AdminRoute;
