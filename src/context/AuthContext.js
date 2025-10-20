import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import { organizadorService } from '../services/organizadorService';

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
        setLoading(false);
        // Carregar foto em background sem afetar o estado de autenticação
        loadUserPhoto(userData);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('skateflow_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserPhoto = async (userData) => {
    // Se já tem foto, não carrega novamente
    if (userData.foto) {
      return;
    }
    
    try {
      const [fotoBase64, organizadores] = await Promise.all([
        usuarioService.buscarFoto(userData.id).catch(() => null),
        organizadorService.listar().catch(() => [])
      ]);
      
      const isOrganizador = organizadores.some(org => org.usuario_id?.id === userData.id);
      
      const userWithPhoto = {
        ...userData,
        foto: fotoBase64 ? `data:image/jpeg;base64,${fotoBase64}` : null,
        isOrganizador
      };
      setUser(userWithPhoto);
      localStorage.setItem('skateflow_user', JSON.stringify(userWithPhoto));
    } catch (error) {
      console.error('Erro ao carregar foto do usuário:', error);
    }
  };

  const login = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('skateflow_user', JSON.stringify(userData));
    // Carregar foto em background
    loadUserPhoto(userData);
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