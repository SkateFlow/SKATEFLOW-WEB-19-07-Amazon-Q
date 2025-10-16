import React, { useState, useEffect } from 'react';
import { FiX, FiUpload, FiChevronDown } from 'react-icons/fi';
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
  SwitchGroup,
  SwitchLabel,
  Switch,
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('[data-dropdown]')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Update form data when pista changes
  useEffect(() => {
    if (pista) {
      const loadPistaData = async () => {
        let pistaData = pista;
        
        // Se a pista tem ID e vem do backend, buscar dados atualizados
        if (pista.id && pista.status === 'backend') {
          try {
            pistaData = await lugarService.buscarPorId(pista.id);
          } catch (error) {
            console.error('Erro ao buscar dados da pista:', error);
            pistaData = pista; // Usar dados originais em caso de erro
          }
        }
        
        const data = {
          nome: pistaData.nome || '',
          descricao: pistaData.descricao || '',
          cep: pistaData.cep || '',
          rua: pistaData.rua || '',
          bairro: pistaData.bairro || '',
          numero: pistaData.numero || '',
          latitude: pistaData.latitude || '',
          longitude: pistaData.longitude || '',
          publica: pistaData.tipo === 'Particular' || pistaData.tipo === 'particular',
          valor: pistaData.valor || 0,
          categoriaId: pistaData.categoria?.id || '',
          fotos: ['', '', '']
        };
        
        // Carregar fotos do sistema
        if (pistaData.id) {
          try {
            const foto1 = await lugarService.buscarFoto1(pistaData.id);
            if (foto1) data.fotos[0] = `data:image/jpeg;base64,${foto1}`;
          } catch (error) {}
          
          try {
            const foto2 = await lugarService.buscarFoto2(pistaData.id);
            if (foto2) data.fotos[1] = `data:image/jpeg;base64,${foto2}`;
          } catch (error) {}
          
          try {
            const foto3 = await lugarService.buscarFoto3(pistaData.id);
            if (foto3) data.fotos[2] = `data:image/jpeg;base64,${foto3}`;
          } catch (error) {}
        }
        
        setFormData(data);
        setOriginalData(data);
        
        // Buscar endereço automaticamente se CEP existir
        if (pistaData.cep && pistaData.cep.length === 8) {
          fetchAddressByCep(pistaData.cep);
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
      try {
        const localizacao = [formData.rua, formData.bairro, formData.numero]
          .filter(item => item && item.trim())
          .join(', ');
        
        // Atualizar pista no backend se for do backend
        if (pista.id && pista.status === 'backend') {
          const pistaAtualizada = {
            nome: formData.nome,
            descricao: formData.descricao,
            cep: formData.cep,
            rua: formData.rua,
            bairro: formData.bairro,
            numero: formData.numero,
            latitude: formData.latitude,
            longitude: formData.longitude,
            tipo: formData.publica ? 'Particular' : 'Pública',
            valor: formData.publica ? formData.valor : 0,
            categoriaId: formData.categoriaId
          };
          
          await lugarService.atualizar(pista.id, pistaAtualizada);
          
          // Salvar fotos se foram alteradas
          for (let i = 0; i < 3; i++) {
            if (formData.fotos[i] && formData.fotos[i] !== originalData.fotos[i] && formData.fotos[i].includes('data:image')) {
              const base64Data = formData.fotos[i].split(',')[1];
              if (i === 0) await lugarService.salvarFoto1(pista.id, base64Data);
              if (i === 1) await lugarService.salvarFoto2(pista.id, base64Data);
              if (i === 2) await lugarService.salvarFoto3(pista.id, base64Data);
            }
          }
        }
        
        // Chamar callback para atualizar lista
        onSave({ 
          ...pista, 
          ...formData,
          categoriaId: formData.categoriaId,
          tipo: formData.publica ? 'Particular' : 'Pública',
          localizacao: localizacao || 'Endereço não informado'
        });
        
        onClose();
      } catch (error) {
        console.error('Erro ao salvar pista:', error);
        alert('Erro ao salvar pista. Tente novamente.');
      }
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
            transition={{ duration: 0.2, layout: { duration: 0.3 } }}
            layout
            layoutRoot
            style={{ transformOrigin: 'top center' }}
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

            <SwitchGroup>
              <SwitchLabel>Pista Privada</SwitchLabel>
              <Switch 
                checked={formData.publica}
                onClick={() => handleInputChange('publica', !formData.publica)}
              />
            </SwitchGroup>

            <AnimatePresence>
              {formData.publica && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ gridColumn: 'span 1', overflow: 'hidden' }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>

            <FormGroup span={2}>
              <Label>Categoria</Label>
              <div style={{ position: 'relative', width: '50%' }} data-dropdown>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ color: formData.categoriaId ? '#1a237e' : '#94a3b8' }}>
                    {formData.categoriaId 
                      ? categorias.find(c => c.id === formData.categoriaId)?.nome || 'Selecione uma categoria'
                      : 'Selecione uma categoria'
                    }
                  </span>
                  <FiChevronDown 
                    style={{ 
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 1000,
                        marginTop: '4px',
                        overflow: 'hidden'
                      }}
                    >

                      {categorias.map((categoria) => (
                        <div
                          key={categoria.id}
                          onClick={() => {
                            handleInputChange('categoriaId', categoria.id);
                            setIsDropdownOpen(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#4a5568',
                            fontWeight: '500',
                            transition: 'background 0.2s ease',
                            background: formData.categoriaId === categoria.id ? '#f7fafc' : 'white'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f7fafc'}
                          onMouseLeave={(e) => e.target.style.background = formData.categoriaId === categoria.id ? '#f7fafc' : 'white'}
                        >
                          {categoria.nome}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {errors.categoriaId && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}
                  >
                    {errors.categoriaId}
                  </motion.div>
                )}
              </AnimatePresence>
            </FormGroup>



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