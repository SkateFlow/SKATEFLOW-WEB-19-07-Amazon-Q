import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormLabel, FormInput, FormButton, BackButton } from './ForgetPassElements';

const ForgetPass = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para armazenar a mensagem de erro

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedEmail = localStorage.getItem('email');

    if (email === storedEmail) {
      alert('Solicitação de recuperação de senha enviada para ' + email);
      setErrorMessage(''); // Limpa a mensagem de erro
    } else {
      setErrorMessage('Email não encontrado. Verifique se está cadastrado.'); // Define a mensagem de erro
    }
  };

  return (
    <Container>
      <FormWrap>
        <Icon to="/">SkateFlow</Icon>
        <FormContent>
          <Form onSubmit={handleSubmit} autoComplete="off">
            <FormH1>Cadastrar Admin</FormH1>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <FormInput 
              type='email' 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              autoComplete="off" 
            />
            {/* Exibe a mensagem de erro */}
            {errorMessage && <p className="error-text">{errorMessage}</p>} 
            <FormButton type='submit'>Enviar</FormButton>
            <BackButton to="/login">Retornar ao Login</BackButton>
          </Form>
        </FormContent>
      </FormWrap>
    </Container>
  );
};

export default ForgetPass;
