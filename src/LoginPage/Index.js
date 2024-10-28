import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormLabel, FormInput, FormButton, Text, BackButton } from './LoginElements';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: email, password: password })
      });

      if (response.ok) {
        navigate('/'); // Login bem-sucedido
      } else {
        setErrorMessage('Email ou senha incorretos'); // Mensagem de erro
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar-se ao servidor');
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
