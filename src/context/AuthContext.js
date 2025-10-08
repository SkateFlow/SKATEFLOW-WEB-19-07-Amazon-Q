import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('skateflow_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('skateflow_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('skateflow_user', JSON.stringify(userData));
  };

  const logout = (reason = null) => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('skateflow_user');
    if (reason && typeof reason === 'string') {
      localStorage.setItem('logout_reason', reason);
    }
  };

  const checkUserExists = async () => {
    // Simplificado para evitar erros quando backend não está disponível
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkUserExists }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;