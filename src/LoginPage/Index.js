import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormLabel, FormInput, FormButton, Text, BackButton } from './LoginElements';
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
      <FormWrap>
        <Icon to="/">SkateFlow</Icon>
        <FormContent>
          <Form onSubmit={handleSubmit} autoComplete="off">
            <FormH1>LOGIN ADMIN</FormH1>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <FormInput 
              type='email' 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              autoComplete="off"
            />
            <FormLabel htmlFor='password'>Senha</FormLabel>
            <FormInput 
              type='password'
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="new-password"
            />
            {errorMessage && <p className="error-text">{errorMessage}</p>}
            <FormButton type='submit' disabled={loading}>
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
