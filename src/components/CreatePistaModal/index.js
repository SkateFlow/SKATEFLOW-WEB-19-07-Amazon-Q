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
  SwitchGroup,
  SwitchLabel,
  Switch,
  ButtonGroup,
  SaveButton,
  CancelButton
} from '../EditEventModal/EditEventModalElements';

const CreatePistaModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cep: '',
    rua: '',
    bairro: '',
    numero: '',
    latitude: '',
    longitude: '',
    publica: true,
    fotos: ['', '', '']
  });
  
  const [locationInfo, setLocationInfo] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
        
        updateLocationInfo(rua, cidade, estado);
      } else {
        setLocationInfo('CEP não encontrado');
      }
    } catch (error) {
      setLocationInfo('Erro ao buscar CEP');
    }
  };
  
  const updateLocationInfo = (rua, cidade, estado) => {
    if (rua && cidade && estado) {
      setLocationInfo(`${rua}, ${cidade} - ${estado}`);
    } else if (cidade && estado) {
      setLocationInfo(`${cidade} - ${estado}`);
    } else {
      setLocationInfo('');
    }
  };

  const handlePhotoChange = async (index, file) => {
    if (file && file instanceof File) {
      try {
        const { convertImageToPngBase64, convertBase64ToDataUrl } = await import('../../utils/imageUtils');
        const base64String = await convertImageToPngBase64(file);
        const dataUrl = convertBase64ToDataUrl(base64String);
        
        const newFotos = [...formData.fotos];
        newFotos[index] = dataUrl;
        setFormData(prev => ({
          ...prev,
          fotos: newFotos
        }));
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      cep: '',
      rua: '',
      bairro: '',
      numero: '',
      latitude: '',
      longitude: '',
      publica: true,
      fotos: ['', '', '']
    });
    setLocationInfo('');
    setErrors({});
  };

  const handleClose = () => {
    const hasData = Object.values(formData).some(value => 
      value !== '' && value !== true && !Array.isArray(value)
    ) || formData.fotos.some(foto => foto !== '');

    if (hasData) {
      setShowConfirmModal(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    resetForm();
    setShowConfirmModal(false);
    onClose();
  };

  const handleConfirmContinue = () => {
    setShowConfirmModal(false);
  };

  const handleSave = () => {
    const fieldMessages = {
      nome: 'Por favor, insira o nome da pista',
      descricao: 'Por favor, insira uma descrição',
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
      const processImagesForSave = async () => {
        const { processImagesForSave: processImages } = await import('../../utils/imageUtils');
        return await processImages(formData.fotos);
      };
      
      processImagesForSave().then(processedImages => {
        const newPista = {
          ...formData,
          id: Date.now(),
          localizacao: `${formData.rua}, ${formData.bairro}`,
          active: false,
          fotos: processedImages
        };
        onSave(newPista);
        resetForm();
        onClose();
      });
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
          style={{ zIndex: 10001 }}
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
              <ModalTitle>Solicitar Nova Pista</ModalTitle>
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
                  <Label>Nome da Pista</Label>
                  <Input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Digite o nome da pista"
                  />
                  <AnimatePresence>
                    {errors.nome && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                      >
                        {errors.nome}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FormGroup>

                <FormGroup span={2}>
                  <Label>Descrição (máx. 250 caracteres)</Label>
                  <TextArea
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    placeholder="Descreva a pista..."
                    maxLength={250}
                  />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {formData.descricao.length}/250 caracteres
                  </span>
                  <AnimatePresence>
                    {errors.descricao && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                      >
                        {errors.descricao}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  <AnimatePresence>
                    {errors.cep && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                      >
                        {errors.cep}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  <AnimatePresence>
                    {errors.numero && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                      >
                        {errors.numero}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FormGroup>

                <FormGroup>
                  <Label>Latitude (opcional)</Label>
                  <Input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="-23.5505"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Longitude (opcional)</Label>
                  <Input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="-46.6333"
                  />
                </FormGroup>
              </FormGrid>

              <SwitchGroup>
                <SwitchLabel>Pista Privada</SwitchLabel>
                <Switch 
                  checked={!formData.publica}
                  onClick={() => handleInputChange('publica', !formData.publica)}
                />
              </SwitchGroup>

              <FormGrid>
              </FormGrid>

              <ButtonGroup>
                <CancelButton onClick={handleClose}>Cancelar</CancelButton>
                <SaveButton onClick={handleSave}>Solicitar Pista</SaveButton>
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
                    Você possui dados não salvos. Deseja continuar preenchendo ou descartar as informações?
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

export default CreatePistaModal;