import React, { useState } from 'react';
import { FiX, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { usuarioService } from '../../services/usuarioService';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  PhotoSection,
  PhotoDisplay,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SwitchGroup,
  SwitchLabel,
  Switch,
  ButtonGroup,
  SaveButton,
  CancelButton
} from './EditUserModalElements';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    isAdmin: false,
    isActive: true,
    foto: ''
  });
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (user) {
      const data = {
        nome: user.nome || '',
        email: user.email || '',
        isAdmin: user.isAdmin || false,
        isActive: user.isActive !== undefined ? user.isActive : true,
        foto: user.foto || ''
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleClose = () => {
    if (hasChanges()) {
      setShowConfirmModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setFormData(originalData);
    setShowConfirmModal(false);
    onClose();
  };

  const handleConfirmContinue = () => {
    setShowConfirmModal(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await usuarioService.atualizar(user.id, formData);
      
      const updatedUser = {
        ...user,
        nome: formData.nome,
        isAdmin: formData.isAdmin,
        isActive: formData.isActive
      };
      
      onSave(updatedUser);
      onClose();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Erro ao atualizar usuário');
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
              <ModalTitle>Editar Usuário</ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <PhotoSection>
                <PhotoDisplay>
                  {formData.foto ? (
                    <img src={formData.foto} alt="Foto do usuário" />
                  ) : (
                    <FiUser />
                  )}
                </PhotoDisplay>
              </PhotoSection>

              <FormGrid>
                <FormGroup>
                  <Label>Nome</Label>
                  <Input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Nome do usuário"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    readOnly
                    style={{ backgroundColor: '#f8fafc' }}
                  />
                </FormGroup>

                <SwitchGroup>
                  <SwitchLabel>Administrador</SwitchLabel>
                  <Switch 
                    checked={formData.isAdmin}
                    onClick={() => handleInputChange('isAdmin', !formData.isAdmin)}
                  />
                </SwitchGroup>

                <SwitchGroup>
                  <SwitchLabel>Usuário Ativo</SwitchLabel>
                  <Switch 
                    checked={formData.isActive}
                    onClick={() => handleInputChange('isActive', !formData.isActive)}
                  />
                </SwitchGroup>
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
                <CancelButton onClick={handleClose} disabled={loading}>Cancelar</CancelButton>
                <SaveButton onClick={handleSave} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </SaveButton>
              </ButtonGroup>
            </ModalContent>
          </ModalContainer>
          
          <AnimatePresence mode="wait">
            {showConfirmModal && (
              <ModalOverlay 
                style={{ zIndex: 1001 }}
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ModalContainer 
                  as={motion.div}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    maxWidth: '400px',
                    padding: '24px',
                    textAlign: 'center'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ModalHeader style={{ borderBottom: 'none', paddingBottom: '0' }}>
                    <ModalTitle style={{ fontSize: '18px' }}>Descartar alterações?</ModalTitle>
                  </ModalHeader>
                  
                  <div style={{ 
                    padding: '20px 0',
                    color: '#64748b',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    Você possui alterações não salvas. Deseja continuar editando ou descartar as alterações?
                  </div>
                  
                  <ButtonGroup>
                    <CancelButton 
                      onClick={handleConfirmDiscard}
                      style={{ flex: 1 }}
                    >
                      Descartar
                    </CancelButton>
                    <SaveButton 
                      onClick={handleConfirmContinue}
                      style={{ flex: 1 }}
                    >
                      Continuar
                    </SaveButton>
                  </ButtonGroup>
                </ModalContainer>
              </ModalOverlay>
            )}
          </AnimatePresence>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default EditUserModal;