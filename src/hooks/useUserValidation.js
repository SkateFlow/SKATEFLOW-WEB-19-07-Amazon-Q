import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export const useUserValidation = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Validação simplificada apenas para manter a sessão
    if (isAuthenticated && location.pathname !== '/login') {
      // Apenas mantém a sessão ativa
      console.log('Usuário autenticado');
    }
  }, [isAuthenticated, location.pathname]);
};

export default useUserValidation;