import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário no localStorage ao carregar a página
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login do usuário
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  // Logout do usuário
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Verificar se o usuário é admin
  const isAdmin = () => {
    return currentUser?.role === 'ADMIN';
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;