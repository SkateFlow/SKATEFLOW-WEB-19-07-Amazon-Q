import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormLabel, FormInput, FormButton, Text, BackButton } from './LoginElements';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensagem de erro

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (email === storedEmail && password === storedPassword) {
      navigate('/'); // Navega para a página inicial ao logar com sucesso
    } else {
      setErrorMessage('Email ou senha incorretos'); // Define a mensagem de erro
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
              type='password' // Removido o toggle de mostrar/esconder senha
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="new-password"
            />
            {errorMessage && <p className="error-text">{errorMessage}</p>} {/* Mensagem de erro */}
            <FormButton type='submit'>Entrar</FormButton>
            <Text>
              <BackButton to="/create-admin">Cadastrar Admin</BackButton> {/* Nova rota */}
            </Text>
            <BackButton to="/">Voltar</BackButton>
          </Form>
        </FormContent>
      </FormWrap>
    </Container>
  );
};

export default Login;
