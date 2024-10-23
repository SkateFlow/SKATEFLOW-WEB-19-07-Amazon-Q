import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormLabel, FormInput, FormButton, Text, BackButton } from './LoginElements';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pegue os dados armazenados
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    // Verifique se os dados existem e se coincidem com a entrada do usuário
    if (!storedEmail || !storedPassword) {
      setErrorMessage('Nenhuma conta encontrada. Por favor, cadastre-se primeiro.');
      return;
    }

    // Comparação de valores
    if (email === storedEmail && password === storedPassword) {
      navigate('/'); // Login bem-sucedido
    } else {
      setErrorMessage('Email ou senha incorretos'); // Mensagem de erro
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
            <FormButton type='submit'>Entrar</FormButton>
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
