import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormLabel, FormInput, FormButton, BackButton } from './CreateAdminElements'; // Altere o caminho para o arquivo de estilo se necessário
import { createAdmin } from '../../services/adminService'; // Certifique-se de que o caminho esteja correto

const CreateAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAdmin = { username, password }; // Cria um objeto para o novo admin
      await createAdmin(newAdmin); // Chama o serviço para criar o admin
      setSuccessMessage('Admin criado com sucesso!');
      setErrorMessage(''); // Limpa a mensagem de erro
      setUsername('');
      setPassword('');
    } catch (error) {
      setErrorMessage('Erro ao criar admin. Tente novamente.'); // Define a mensagem de erro
      setSuccessMessage(''); // Limpa a mensagem de sucesso
    }
  };

  return (
    <Container>
      <FormWrap>
        <Icon to="/">SkateFlow</Icon>
        <FormContent>
          <Form onSubmit={handleSubmit} autoComplete="off">
            <FormH1>Cadastrar Admin</FormH1>
            <FormLabel htmlFor='username'>Email do Usuario</FormLabel>
            <FormInput 
              type='text' 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              autoComplete="off" 
            />
            <FormLabel htmlFor='password'>Senha</FormLabel>
            <FormInput 
              type='password' 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="off" 
            />
            {/* Exibe mensagens de erro ou sucesso */}
            {errorMessage && <p className="error-text">{errorMessage}</p>}
            {successMessage && <p className="success-text">{successMessage}</p>}
            <FormButton type='submit'>Criar Admin</FormButton>
            <BackButton to="/login">Retornar ao Login</BackButton>
          </Form>
        </FormContent>
      </FormWrap>
    </Container>
  );
};

export default CreateAdmin;
