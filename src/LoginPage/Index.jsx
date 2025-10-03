import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormInput, FormButton, BackButton } from './LoginElements';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usuarioService } from '../services/usuarioService';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logoWhite from '../assets/images/logoof1.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isRegister) {
        // Cadastro
        if (!email || !password || !username || !confirmPassword) {
          setErrorMessage('Preencha todos os campos');
          return;
        }
        
        if (username.length < 3) {
          setErrorMessage('Nome de usuário deve ter pelo menos 3 caracteres');
          return;
        }
        
        if (password.length < 8) {
          setErrorMessage('Senha deve ter pelo menos 8 caracteres');
          return;
        }
        
        if (!/[A-Z]/.test(password)) {
          setErrorMessage('Senha deve ter pelo menos 1 letra maiúscula');
          return;
        }
        
        if (!/[0-9]/.test(password)) {
          setErrorMessage('Senha deve ter pelo menos 1 número');
          return;
        }
        
        if (password !== confirmPassword) {
          setErrorMessage('Senhas não coincidem');
          return;
        }

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
        login(usuario);
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

            <div className="input-group">
              <FormInput
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="form-input"
              />
            </div>

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
                />
              </div>
            )}

            <div className="input-group password-group">
              <FormInput
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="form-input password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
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
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
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
              <BackButton to="/" className="back-button">Voltar ao início</BackButton>
            </div>
          </Form>
        </FormContent>
      </FormWrap>
    </Container>

  );
};

export default Login;
