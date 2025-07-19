import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  // Mostrar um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Verificar se o usuário está autenticado
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  // Verificar se a rota requer privilégios de admin
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute;