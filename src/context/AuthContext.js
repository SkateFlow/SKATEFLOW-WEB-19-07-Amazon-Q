import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('skateflow_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
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
    if (reason) {
      localStorage.setItem('logout_reason', reason);
    }
  };

  const checkUserExists = async () => {
    if (!user?.id) return true;
    
    try {
      await usuarioService.buscarPorId(user.id);
      return true;
    } catch (error) {
      console.log('Erro ao verificar usuário:', error);
      if (error === 'Usuário não encontrado' || 
          (typeof error === 'string' && error.includes('404')) ||
          error === 'Servidor não disponível') {
        if (error !== 'Servidor não disponível') {
          logout('Sua conta foi removida do sistema. Você precisará criar uma nova conta.');
          return false;
        }
      }
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkUserExists }}>
      {children}
    </AuthContext.Provider>
  );
};