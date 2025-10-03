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
        
        setErrorMessage('Cadastro realizado com sucesso!');
        setIsRegister(false);
        
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
        top: '2%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <Icon to="/">
          <img src={logoWhite} alt="SkateFlow" style={{ height: '180px', width: 'auto' }} />
        </Icon>
      </div>

      {/* Formulário centralizado */}
      <FormWrap>
    <FormContent>
      <Form
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{
          borderRadius: '15px',
          padding: '30px',
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
        }}
      >
        <FormH1 style={{ color: '#222' }}>{isRegister ? 'CADASTRO' : 'LOGIN'}</FormH1>

        <FormInput
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          style={{ 
            color: '#333',
            background: 'transparent',
            border: 'none',
            borderBottom: '2px solid #ccc',
            borderRadius: '0',
            padding: '10px 0',
            outline: 'none',
            marginBottom: '20px'
          }}
        />

        {isRegister && (
          <FormInput
            type="text"
            placeholder="Nome de usuário"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            style={{ 
              color: '#333',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid #ccc',
              borderRadius: '0',
              padding: '10px 0',
              outline: 'none',
              marginBottom: '20px'
            }}
          />
        )}

        <div style={{ position: 'relative', marginBottom: isRegister ? '20px' : '40px' }}>
          <FormInput
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            style={{ 
              color: '#333',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid #ccc',
              borderRadius: '0',
              padding: '10px 25px 10px 0',
              outline: 'none',
              width: '100%'
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0px',
              top: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#999',
              fontSize: '16px',
              padding: '0'
            }}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {isRegister && (
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <FormInput
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              style={{ 
                color: '#333',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid #ccc',
                borderRadius: '0',
                padding: '10px 25px 10px 0',
                outline: 'none',
                width: '100%'
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '0px',
                top: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                fontSize: '16px',
                padding: '0'
              }}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        )}

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <FormButton type="submit" disabled={loading}
          style={{
            borderRadius: '17px'
          }}
        >
          {loading ? 'Carregando...' : (isRegister ? 'Cadastrar' : 'Entrar')}
        </FormButton>

        <BackButton onClick={() => setIsRegister(!isRegister)} style={{ color: '#222', cursor: 'pointer' }}>
          {isRegister ? 'Já tem conta? Entrar' : 'Cadastrar'}
        </BackButton>
        <BackButton to="/" style={{ color: '#222' }}>Voltar</BackButton>
      </Form>
    </FormContent>
  </FormWrap>
</Container>

  );
};

export default Login;
