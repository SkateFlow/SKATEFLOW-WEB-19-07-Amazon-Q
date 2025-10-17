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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('skateflow_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        loadUserPhoto(userData);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('skateflow_user');
      }
    }
    setLoading(false);
  }, []);

  const loadUserPhoto = async (userData) => {
    // Se já tem foto, não carrega novamente
    if (userData.foto) {
      setUser(userData);
      setIsAuthenticated(true);
      return;
    }
    
    try {
      const fotoBase64 = await usuarioService.buscarFoto(userData.id);
      const userWithPhoto = {
        ...userData,
        foto: fotoBase64 ? `data:image/jpeg;base64,${fotoBase64}` : null
      };
      setUser(userWithPhoto);
      setIsAuthenticated(true);
      localStorage.setItem('skateflow_user', JSON.stringify(userWithPhoto));
    } catch (error) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  };

  const login = async (userData) => {
    await loadUserPhoto(userData);
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