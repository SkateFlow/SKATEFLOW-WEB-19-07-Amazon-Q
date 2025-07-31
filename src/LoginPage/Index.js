import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormInput, FormButton, Text, BackButton } from './LoginElements';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

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

    try {
      const response = await api.post('/admin/login', { 
        username: email, 
        password: password 
      });

      if (response.status === 200) {
        // Salvar dados do usuário no contexto de autenticação
        login({
          ...response.data,
          role: 'ADMIN'
        });
        navigate('/adminhome');
      } else {
        setErrorMessage('Email ou senha incorretos');
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar-se ao servidor');
      console.error('Erro de login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
  {/* Nome SkateFlow com margem do topo */}
  <div style={{ textAlign: 'center', marginTop: 'center' }}>
    <Icon to="/" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
      SkateFlow
    </Icon>
  </div>

  {/* Formulário centralizado e com bordas arredondadas */}
  <FormWrap id>
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

        <Text>
          <BackButton to="/create-admin">Cadastrar Admin</BackButton>
        </Text>

        <BackButton to="/">Voltar</BackButton>
      </Form>
    </FormContent>
  </FormWrap>
</Container>

  );
};

export default Login;
