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
  PublishedBy,
  SwitchGroup,
  SwitchLabel,
  Switch,
  ButtonGroup,
  SaveButton,
  CancelButton
} from './EditEventModalElements';

const EditEventModal = ({ isOpen, onClose, event, onSave }) => {
  const [formData, setFormData] = useState({
    nomeEvento: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    linkSite: '',
    ativo: true,
    fotos: ['', '', '']
  });
  
  const [locationInfo, setLocationInfo] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [originalData, setOriginalData] = useState({});

  React.useEffect(() => {
    if (event) {
      const data = {
        nomeEvento: event.nomeEvento || '',
        descricao: event.descricao || '',
        dataInicio: event.dataInicio || '',
        dataFim: event.dataFim || '',
        linkSite: event.linkSite || '',
        ativo: event.ativo !== undefined ? event.ativo : true,
        fotos: event.fotos || ['', '', '']
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [event]);

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

  const handlePhotoChange = (index, file) => {
    if (file && file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFotos = formData.fotos ? [...formData.fotos] : ['', '', ''];
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
      dataFim: 'Por favor, insira a data de fim'
    };
    
    const newErrors = {};
    
    Object.keys(fieldMessages).forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = fieldMessages[field];
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSave({ ...event, ...formData });
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
              <ModalTitle>
                {event ? 'Editar Evento' : (window.location.pathname.includes('/admin') ? 'Cadastrar Evento' : 'Solicitar Evento')}
              </ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <PhotoSection>
                {[0, 1, 2].map((index) => (
                  <PhotoUpload key={index}>
                    {formData.fotos && formData.fotos[index] ? (
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
                  <AnimatePresence>
                    {errors.nomeEvento && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                      >
                        {errors.nomeEvento}
                      </motion.div>
                    )}
                  </AnimatePresence>
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

                {event && window.location.pathname.includes('/admin') && (
                  <div style={{ 
                    gridColumn: 'span 2',
                    marginBottom: '16px', 
                    padding: '16px', 
                    background: '#f8fafc', 
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Data de cadastro:</strong> {event?.dataCadastro || new Date().toLocaleDateString('pt-BR')}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Evento publicado por:</strong> {event?.publicadoPor || 'Usuário não informado'}
                    </div>
                    <div>
                      <strong>Status atual:</strong> {event?.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                )}



                <FormGroup>
                  <Label>Data de Início</Label>
                  <Input
                    type="datetime-local"
                    value={formData.dataInicio}
                    onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                  />
                  <AnimatePresence>
                    {errors.dataInicio && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                      >
                        {errors.dataInicio}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FormGroup>

                <FormGroup>
                  <Label>Data de Fim</Label>
                  <Input
                    type="datetime-local"
                    value={formData.dataFim}
                    onChange={(e) => handleInputChange('dataFim', e.target.value)}
                  />
                  <AnimatePresence>
                    {errors.dataFim && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                      >
                        {errors.dataFim}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FormGroup>

                <FormGroup span={2}>
                  <Label>Link do Site do Evento (opcional)</Label>
                  <Input
                    type="url"
                    value={formData.linkSite}
                    onChange={(e) => handleInputChange('linkSite', e.target.value)}
                    placeholder="https://exemplo.com"
                  />
                </FormGroup>



                {window.location.pathname.includes('/admin') && (
                  <SwitchGroup>
                    <SwitchLabel>Evento Ativo</SwitchLabel>
                    <Switch 
                      checked={formData.ativo}
                      onClick={() => handleInputChange('ativo', !formData.ativo)}
                    />
                  </SwitchGroup>
                )}
              </FormGrid>

              <ButtonGroup>
                <CancelButton onClick={handleClose}>Cancelar</CancelButton>
                <SaveButton onClick={handleSave}>
                  {event ? 'Salvar Alterações' : (window.location.pathname.includes('/admin') ? 'Cadastrar Evento' : 'Solicitar Evento')}
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

export default EditEventModal;