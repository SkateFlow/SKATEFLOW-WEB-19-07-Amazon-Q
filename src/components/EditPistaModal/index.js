import React, { useState, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { lugarService } from '../../services/lugarService';
import { categoriaService } from '../../services/categoriaService';
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
    valor: 0,
    categoriaId: '',
    fotos: ['', '', '']
  });
  
  const [locationInfo, setLocationInfo] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [categorias, setCategorias] = useState([]);

  // Carregar categorias
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const categoriasData = await categoriaService.listar();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    loadCategorias();
  }, []);

  // Update form data when pista changes
  useEffect(() => {
    if (pista) {
      const loadPistaData = async () => {
        const data = {
          nome: pista.nome || '',
          descricao: pista.descricao || '',
          cep: pista.cep || '',
          rua: pista.rua || '',
          bairro: pista.bairro || '',
          numero: pista.numero || '',
          latitude: pista.latitude || '',
          longitude: pista.longitude || '',
          publica: pista.tipo === 'Pública' || pista.publica || false,
          valor: pista.valor || 0,
          categoriaId: pista.categoria?.id || '',
          fotos: ['', '', '']
        };
        
        // Carregar fotos do sistema
        if (pista.id) {
          try {
            const foto1 = await lugarService.buscarFoto1(pista.id);
            if (foto1) data.fotos[0] = `data:image/jpeg;base64,${foto1}`;
          } catch (error) {}
          
          try {
            const foto2 = await lugarService.buscarFoto2(pista.id);
            if (foto2) data.fotos[1] = `data:image/jpeg;base64,${foto2}`;
          } catch (error) {}
          
          try {
            const foto3 = await lugarService.buscarFoto3(pista.id);
            if (foto3) data.fotos[2] = `data:image/jpeg;base64,${foto3}`;
          } catch (error) {}
        }
        
        setFormData(data);
        setOriginalData(data);
        
        // Buscar endereço automaticamente se CEP existir
        if (pista.cep && pista.cep.length === 8) {
          fetchAddressByCep(pista.cep);
        }
      };
      
      loadPistaData();
    }
  }, [pista]);

  const formatCep = (value) => {
    const cleanCep = value.replace(/\D/g, '');
    if (cleanCep.length <= 5) {
      return cleanCep;
    }
    return cleanCep.replace(/(\d{5})(\d{1,3})/, '$1-$2');
  };

  const handleInputChange = (field, value) => {
    if (field === 'cep') {
      const cleanCep = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: cleanCep
      }));
      
      if (cleanCep.length === 8) {
        fetchAddressByCep(cleanCep);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
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
        
        if (cidade && estado) {
          setLocationInfo(`${cidade} - ${estado}`);
        }
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

  const handlePhotoChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFotos = [...formData.fotos];
        newFotos[index] = e.target.result;
        setFormData(prev => ({
          ...prev,
          fotos: newFotos
        }));
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

  const handleSave = async () => {
    const fieldMessages = {
      nome: 'Por favor, insira o nome da pista',
      descricao: 'Por favor, insira uma descrição',
      cep: 'Por favor, insira o CEP',
      rua: 'Por favor, insira o nome da rua',
      bairro: 'Por favor, insira o bairro',
      numero: 'Por favor, insira o número do local',
      latitude: 'Por favor, insira a latitude',
      longitude: 'Por favor, insira a longitude',
      categoriaId: 'Por favor, selecione uma categoria'
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
      
      // Salvar dados da pista
      onSave({ 
        ...pista, 
        ...formData,
        categoriaId: formData.categoriaId,
        tipo: formData.publica ? 'Pública' : 'Particular',
        localizacao: localizacao || 'Endereço não informado'
      });
      
      // Salvar fotos se foram alteradas
      if (pista.id && pista.status === 'backend') {
        try {
          for (let i = 0; i < 3; i++) {
            if (formData.fotos[i] && formData.fotos[i] !== originalData.fotos[i] && formData.fotos[i].includes('data:image')) {
              const base64Data = formData.fotos[i].split(',')[1];
              if (i === 0) await lugarService.salvarFoto1(pista.id, base64Data);
              if (i === 1) await lugarService.salvarFoto2(pista.id, base64Data);
              if (i === 2) await lugarService.salvarFoto3(pista.id, base64Data);
            }
          }
        } catch (error) {
          console.error('Erro ao salvar fotos:', error);
        }
      }
      
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
                value={formatCep(formData.cep)}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                placeholder="00000-000"
                maxLength={9}
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
                onChange={(e) => handleInputChange('rua', e.target.value)}
                placeholder="Rua será preenchida automaticamente"
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
                placeholder="Bairro será preenchido automaticamente"
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
              <Label>Categoria</Label>
              <select
                value={formData.categoriaId}
                onChange={(e) => handleInputChange('categoriaId', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </FormGroup>

            {!formData.publica && (
              <FormGroup>
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => handleInputChange('valor', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </FormGroup>
            )}

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