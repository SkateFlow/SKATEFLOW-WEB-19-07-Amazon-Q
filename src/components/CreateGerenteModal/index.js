import React, { useState } from 'react';
import { FiX, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { usuarioService } from '../../services/usuarioService';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  FormGrid,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  SaveButton,
  CancelButton,
  IconInput
} from './CreateGerenteModalElements';

const CreateGerenteModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleClose = () => {
    setFormData({ nome: '', email: '', senha: '' });
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.email.trim() || !formData.senha.trim()) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const novoGerente = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha,
        nivelAcesso: 'GERENTE'
      };
      
      await usuarioService.cadastrar(novoGerente);
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Erro ao cadastrar gerente';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <ModalOverlay 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <ModalContainer 
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Cadastrar Gerente</ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <FormGroup>
                    <Label>Nome Completo</Label>
                    <IconInput>
                      <FiUser className="input-icon" />
                      <Input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        placeholder="Digite o nome completo"
                        required
                      />
                    </IconInput>
                  </FormGroup>

                  <FormGroup>
                    <Label>Email</Label>
                    <IconInput>
                      <FiMail className="input-icon" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Digite o email"
                        required
                      />
                    </IconInput>
                  </FormGroup>

                  <FormGroup>
                    <Label>Senha</Label>
                    <IconInput>
                      <FiLock className="input-icon" />
                      <Input
                        type="password"
                        value={formData.senha}
                        onChange={(e) => handleInputChange('senha', e.target.value)}
                        placeholder="Digite a senha (mín. 6 caracteres)"
                        required
                        minLength={6}
                      />
                    </IconInput>
                  </FormGroup>
                </FormGrid>

                {error && (
                  <div style={{
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px',
                    color: '#dc2626',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}

                <ButtonGroup>
                  <CancelButton type="button" onClick={handleClose} disabled={loading}>
                    Cancelar
                  </CancelButton>
                  <SaveButton type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Gerente'}
                  </SaveButton>
                </ButtonGroup>
              </form>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CreateGerenteModal;