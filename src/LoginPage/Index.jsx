import React, { useState, useEffect } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormInput, FormButton, BackButton } from './LoginElements';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usuarioService } from '../services/usuarioService';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logoWhite from '../assets/images/logoof1.svg';
import styled from 'styled-components';

const FieldError = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountDeletedMessage, setAccountDeletedMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [showLoginNotification, setShowLoginNotification] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const logoutReason = localStorage.getItem('logout_reason');
    if (logoutReason) {
      setAccountDeletedMessage(logoutReason);
      localStorage.removeItem('logout_reason');
    }
    
    const loginMsg = localStorage.getItem('login_message');
    if (loginMsg) {
      setLoginMessage(loginMsg);
      setShowLoginNotification(true);
      localStorage.removeItem('login_message');
      setTimeout(() => {
        setShowLoginNotification(false);
        setLoginMessage('');
      }, 4000);
    }
  }, []);

  const validateFields = () => {
    const errors = {};
    
    if (isRegister) {
      if (!username) errors.username = 'Nome de usuário é obrigatório';
      if (!email) errors.email = 'Email é obrigatório';
      if (!password) errors.password = 'Senha é obrigatória';
      if (!confirmPassword) errors.confirmPassword = 'Confirmação de senha é obrigatória';
      
      if (username && username.length < 3) {
        errors.username = 'Nome deve ter pelo menos 3 caracteres';
      }
      if (password && password.length < 8) {
        errors.password = 'Senha deve ter pelo menos 8 caracteres';
      }
      if (password && !/[A-Z]/.test(password)) {
        errors.password = 'Senha deve ter pelo menos 1 letra maiúscula';
      }
      if (password && !/[0-9]/.test(password)) {
        errors.password = 'Senha deve ter pelo menos 1 número';
      }
      if (password && confirmPassword && password !== confirmPassword) {
        errors.confirmPassword = 'Senhas não coincidem';
      }
    } else {
      if (!email) errors.email = 'Email é obrigatório';
      if (!password) errors.password = 'Senha é obrigatória';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setAccountDeletedMessage('');
    setLoginMessage('');
    
    const errors = validateFields();
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {

        await usuarioService.cadastrar({
          nome: username,
          email: email,
          senha: password
        });
        
        setSuccessMessage('Cadastro realizado com sucesso!');
        setTimeout(() => {
          setIsRegister(false);
          setSuccessMessage('');
        }, 2000);
        
      } else {
        // Login
        if (!email || !password) {
          setErrorMessage('Preencha email e senha');
          return;
        }

        const usuario = await usuarioService.login(email, password);
        await login(usuario);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : 'Erro na operação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Logo branca centralizada */}
      <div style={{ 
        position: 'absolute',
        top: '3%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <Icon to="/">
          <img 
            src={logoWhite} 
            alt="SkateFlow" 
            className="login-logo"
            style={{ height: '120px', width: 'auto' }} 
          />
        </Icon>
      </div>

      {/* Formulário centralizado */}
      <FormWrap>
        <FormContent>
          <Form onSubmit={handleSubmit} autoComplete="off" className="login-form">
            <FormH1>{isRegister ? 'CADASTRO' : 'LOGIN'}</FormH1>

            {isRegister && (
              <div className="input-group">
                <FormInput
                  type="text"
                  placeholder="Nome de usuário"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  className="form-input"
                  style={{ borderBottomColor: fieldErrors.username ? '#f44336' : '#e0e0e0' }}
                />
                {fieldErrors.username && <FieldError>{fieldErrors.username}</FieldError>}
              </div>
            )}

            <div className="input-group">
              <FormInput
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="form-input"
                style={{ borderBottomColor: fieldErrors.email ? '#f44336' : '#e0e0e0' }}
              />
              {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
            </div>

            <div className="input-group password-group">
              <FormInput
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="form-input password-input"
                style={{ borderBottomColor: fieldErrors.password ? '#f44336' : '#e0e0e0' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
            </div>

            {isRegister && (
              <div className="input-group password-group">
                <FormInput
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar senha"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="form-input password-input"
                  style={{ borderBottomColor: fieldErrors.confirmPassword ? '#f44336' : '#e0e0e0' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                {fieldErrors.confirmPassword && <FieldError>{fieldErrors.confirmPassword}</FieldError>}
              </div>
            )}

            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <p>{successMessage}</p>
              </div>
            )}

            {accountDeletedMessage && (
              <div className="account-deleted-message">
                <p>{accountDeletedMessage}</p>
              </div>
            )}



            <FormButton type="submit" disabled={loading} className="submit-button">
              {loading ? 'Carregando...' : (isRegister ? 'Cadastrar' : 'Entrar')}
            </FormButton>

            <div className="form-links">
              <BackButton 
                onClick={() => setIsRegister(!isRegister)} 
                className="toggle-button"
              >
                {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastrar'}
              </BackButton>
              {isRegister && (
                <Link to="/cadastro-organizador" className="toggle-button" style={{ color: '#666' }}>Quer ser Organizador?</Link>
              )}
              {!isRegister && (
                <Link to="/forgot-password" className="toggle-button">Esqueceu a senha?</Link>
              )}
              <Link to="/" className="toggle-button" style={{ color: '#666' }}>Voltar ao início</Link>
            </div>
          </Form>
        </FormContent>
      </FormWrap>
      
      <div style={{
        position: 'fixed',
        top: '84px',
        left: '50%',
        transform: `translateX(-50%) translateY(${showLoginNotification ? '0' : '-100%'})`,
        background: '#11406dff',
        color: 'white',
        padding: '16px 32px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 1000,
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        display: 'inline-block',
        width: 'auto',
        minWidth: 'fit-content',
        opacity: showLoginNotification ? 1 : 0,
        transition: 'all 0.3s ease'
      }}>
        {loginMessage}
      </div>
    </Container>

  );
};

export default Login;
