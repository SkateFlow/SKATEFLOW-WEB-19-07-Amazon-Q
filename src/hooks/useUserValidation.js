import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const useUserValidation = () => {
  const { user, isAuthenticated, checkUserExists } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const intervalRef = useRef(null);

  useEffect(() => {
    // Não valida na página de login
    if (!isAuthenticated || !user || location.pathname === '/login') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const validateUser = async () => {
      try {
        const exists = await checkUserExists();
        if (!exists) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro na validação do usuário:', error);
      }
    };

    // Listener para evento de exclusão de usuário
    const handleUserDeleted = (event) => {
      const { deletedUserId } = event.detail;
      if (user.id === deletedUserId) {
        validateUser();
      }
    };

    // Adiciona listener
    window.addEventListener('userDeleted', handleUserDeleted);

    // Verifica imediatamente
    validateUser();

    // Verifica a cada 30 segundos
    intervalRef.current = setInterval(validateUser, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener('userDeleted', handleUserDeleted);
    };
  }, [isAuthenticated, user, checkUserExists, navigate, location.pathname]);
};