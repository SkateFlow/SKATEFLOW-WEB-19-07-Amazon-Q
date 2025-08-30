import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormInput, FormButton, BackButton } from './LoginElements';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Login simples para demonstração
    if (email && password) {
      login(email);
      navigate('/');
    } else {
      setErrorMessage('Preencha email e senha');
    }
    
    setLoading(false);
  };

  return (
    <Container>
      {/* Nome SkateFlow centralizado */}
      <div style={{ 
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <Icon to="/" style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>
          SkateFlow
        </Icon>
      </div>

      {/* Formulário centralizado */}
      <FormWrap>
    <FormContent>
      <Form
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{
          borderRadius: '25px',
          padding: '40px',
          backgroundColor: '#111111cc',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <FormH1>LOGIN ADMIN</FormH1>

        <FormInput
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          style={{ 
            color: '#333', 
            borderRadius: '10px',
          }}
        />

        <FormInput
          type="password"
          placeholder="Senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          style={{ 
            color: '#333',
            borderRadius: '10px',
          }}
        />

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <FormButton type="submit" disabled={loading}
          style={{
            borderRadius: '17px'
          }}
        >
          {loading ? 'Carregando...' : 'Entrar'}
        </FormButton>

        <BackButton to="/">Voltar</BackButton>
      </Form>
    </FormContent>
  </FormWrap>
</Container>

  );
};

export default Login;
