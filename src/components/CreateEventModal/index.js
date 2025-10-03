import React, { useState } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  PhotoSection,
  PhotoUpload,
  FormGrid,
  FormGroup,
  Label,
  Input,
  TextArea,
  ButtonGroup,
  SaveButton,
  CancelButton
} from '../EditEventModal/EditEventModalElements';

const CreateEventModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nomeEvento: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    cep: '',
    rua: '',
    bairro: '',
    numero: '',
    fotos: ['', '', '']
  });
  
  const [locationInfo, setLocationInfo] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [originalData, setOriginalData] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      const emptyData = {
        nomeEvento: '',
        descricao: '',
        dataInicio: '',
        dataFim: '',
        cep: '',
        rua: '',
        bairro: '',
        numero: '',
        fotos: ['', '', '']
      };
      setFormData(emptyData);
      setOriginalData(emptyData);
      setErrors({});
      setLocationInfo('');
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'cep' && value.length === 8) {
      fetchAddressByCep(value);
    }
  };

  const fetchAddressByCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        const rua = data.logradouro || '';
        const bairro = data.bairro || '';
        const cidade = data.localidade || '';
        const estado = data.uf || '';
        
        setFormData(prev => ({
          ...prev,
          rua,
          bairro
        }));
        
        setLocationInfo(`${rua}, ${cidade} - ${estado}`);
      } else {
        setLocationInfo('CEP não encontrado');
      }
    } catch (error) {
      setLocationInfo('Erro ao buscar CEP');
    }
  };

  const handlePhotoChange = (index, file) => {
    if (file && file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFotos = [...formData.fotos];
        newFotos[index] = e.target.result;
        setFormData(prev => ({
          ...prev,
          fotos: newFotos
        }));
      };
      reader.onerror = () => {
        console.error('Erro ao ler arquivo');
      };
      reader.readAsDataURL(file);
    }
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
    setErrors({});
    setShowConfirmModal(false);
    onClose();
  };

  const handleConfirmContinue = () => {
    setShowConfirmModal(false);
  };

  const handleSave = () => {
    const fieldMessages = {
      nomeEvento: 'Por favor, insira o nome do evento',
      descricao: 'Por favor, insira uma descrição',
      dataInicio: 'Por favor, insira a data de início',
      dataFim: 'Por favor, insira a data de fim',
      cep: 'Por favor, insira o CEP',
      numero: 'Por favor, insira o número do local'
    };
    
    const newErrors = {};
    
    Object.keys(fieldMessages).forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = fieldMessages[field];
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      onClose();
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
              <ModalTitle>Solicitar Evento</ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <PhotoSection>
                {[0, 1, 2].map((index) => (
                  <PhotoUpload key={index}>
                    {formData.fotos[index] ? (
                      <img 
                        src={formData.fotos[index]} 
                        alt={`Preview ${index + 1}`}
                      />
                    ) : (
                      <>
                        <FiUpload />
                        <span>Foto {index + 1}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePhotoChange(index, file);
                        }
                      }}
                    />
                  </PhotoUpload>
                ))}
              </PhotoSection>

              <FormGrid>
                <FormGroup span={2}>
                  <Label>Nome do Evento</Label>
                  <Input
                    type="text"
                    value={formData.nomeEvento}
                    onChange={(e) => handleInputChange('nomeEvento', e.target.value)}
                    placeholder="Digite o nome do evento"
                  />
                  {errors.nomeEvento && (
                    <span style={{ color: '#dc2626', fontSize: '12px' }}>
                      {errors.nomeEvento}
                    </span>
                  )}
                </FormGroup>

                <FormGroup span={2}>
                  <Label>Descrição (máx. 250 caracteres)</Label>
                  <TextArea
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    placeholder="Descreva o evento..."
                    maxLength={250}
                  />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {(formData.descricao || '').length}/250 caracteres
                  </span>
                  {errors.descricao && (
                    <span style={{ color: '#dc2626', fontSize: '12px' }}>
                      {errors.descricao}
                    </span>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Data de Início</Label>
                  <Input
                    type="datetime-local"
                    value={formData.dataInicio}
                    onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                  />
                  {errors.dataInicio && (
                    <span style={{ color: '#dc2626', fontSize: '12px' }}>
                      {errors.dataInicio}
                    </span>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Data de Fim</Label>
                  <Input
                    type="datetime-local"
                    value={formData.dataFim}
                    onChange={(e) => handleInputChange('dataFim', e.target.value)}
                  />
                  {errors.dataFim && (
                    <span style={{ color: '#dc2626', fontSize: '12px' }}>
                      {errors.dataFim}
                    </span>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>CEP</Label>
                  <Input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                    placeholder="00000-000"
                    maxLength={8}
                  />
                  {errors.cep && (
                    <span style={{ color: '#dc2626', fontSize: '12px' }}>
                      {errors.cep}
                    </span>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Rua</Label>
                  <Input
                    type="text"
                    value={formData.rua}
                    readOnly
                    style={{ backgroundColor: '#f8fafc' }}
                  />
                  {locationInfo && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#3b82f6', 
                      marginTop: '4px',
                      fontWeight: '500'
                    }}>
                      📍 {locationInfo}
                    </div>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Bairro</Label>
                  <Input
                    type="text"
                    value={formData.bairro}
                    readOnly
                    style={{ backgroundColor: '#f8fafc' }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Número do Local</Label>
                  <Input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => handleInputChange('numero', e.target.value)}
                    placeholder="Número"
                  />
                  {errors.numero && (
                    <span style={{ color: '#dc2626', fontSize: '12px' }}>
                      {errors.numero}
                    </span>
                  )}
                </FormGroup>
              </FormGrid>

              <ButtonGroup>
                <CancelButton onClick={handleClose}>Cancelar</CancelButton>
                <SaveButton onClick={handleSave}>Solicitar Evento</SaveButton>
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

export default CreateEventModal;