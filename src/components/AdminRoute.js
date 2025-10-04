import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.nivelAcesso !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default AdminRoute;