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
  CheckboxGroup,
  Checkbox,
  CheckboxLabel,
  ButtonGroup,
  SaveButton,
  CancelButton
} from './EditPistaModalElements';

const EditPistaModal = ({ isOpen, onClose, pista, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cep: '',
    rua: '',
    bairro: '',
    numero: '',
    latitude: '',
    longitude: '',
    publica: false,
    fotos: ['', '', '']
  });
  
  const [locationInfo, setLocationInfo] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // Update form data when pista changes
  React.useEffect(() => {
    if (pista) {
      const data = {
        nome: pista.nome || '',
        descricao: pista.descricao || '',
        cep: pista.cep || '',
        rua: pista.rua || '',
        bairro: pista.bairro || '',
        numero: pista.numero || '',
        latitude: pista.latitude || '',
        longitude: pista.longitude || '',
        publica: pista.publica || false,
        fotos: pista.fotos || ['', '', '']
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [pista]);

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
  
  const handleRuaChange = (value) => {
    setFormData(prev => ({ ...prev, rua: value }));
    // Update location info when street changes
    const cidade = formData.cidade || '';
    const estado = formData.estado || '';
    updateLocationInfo(value, cidade, estado);
  };

  const handlePhotoChange = (index, value) => {
    const newFotos = [...formData.fotos];
    newFotos[index] = value;
    setFormData(prev => ({
      ...prev,
      fotos: newFotos
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
    setErrors({});
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
      rua: 'Por favor, insira o nome da rua',
      bairro: 'Por favor, insira o bairro',
      numero: 'Por favor, insira o número do local',
      latitude: 'Por favor, insira a latitude',
      longitude: 'Por favor, insira a longitude'
    };
    
    const newErrors = {};
    
    Object.keys(fieldMessages).forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = fieldMessages[field];
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const localizacao = [formData.rua, formData.bairro, formData.numero]
        .filter(item => item && item.trim())
        .join(', ');
      
      onSave({ 
        ...pista, 
        ...formData, 
        localizacao: localizacao || 'Endereço não informado'
      });
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
          <ModalTitle>Editar Pista</ModalTitle>
          <CloseButton onClick={handleClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <PhotoSection>
            {[0, 1, 2].map((index) => (
              <PhotoUpload key={index}>
                <FiUpload />
                <span>Foto {index + 1}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(index, e.target.files[0])}
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
                onChange={(e) => handleRuaChange(e.target.value)}
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
              <AnimatePresence>
                {errors.rua && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                  >
                    {errors.rua}
                  </motion.div>
                )}
              </AnimatePresence>
            </FormGroup>

            <FormGroup>
              <Label>Bairro</Label>
              <Input
                type="text"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                readOnly
                style={{ backgroundColor: '#f8fafc' }}
              />
              <AnimatePresence>
                {errors.bairro && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                  >
                    {errors.bairro}
                  </motion.div>
                )}
              </AnimatePresence>
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

            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                checked={formData.publica}
                onChange={(e) => handleInputChange('publica', e.target.checked)}
              />
              <CheckboxLabel>Pista Pública</CheckboxLabel>
            </CheckboxGroup>

            <FormGroup>
              <Label>Latitude</Label>
              <Input
                type="text"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
                placeholder="-23.550520"
              />
              <AnimatePresence>
                {errors.latitude && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                  >
                    {errors.latitude}
                  </motion.div>
                )}
              </AnimatePresence>
            </FormGroup>

            <FormGroup>
              <Label>Longitude</Label>
              <Input
                type="text"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                placeholder="-46.633308"
              />
              <AnimatePresence>
                {errors.longitude && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                  >
                    {errors.longitude}
                  </motion.div>
                )}
              </AnimatePresence>
            </FormGroup>
          </FormGrid>

          <ButtonGroup>
            <CancelButton onClick={handleClose}>Cancelar</CancelButton>
            <SaveButton onClick={handleSave}>Salvar Alterações</SaveButton>
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

export default EditPistaModal;