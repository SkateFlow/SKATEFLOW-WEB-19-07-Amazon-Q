import React, { useState, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import PistaRequestConfirmModal from '../PistaRequestConfirmModal';
import { categoriaService } from '../../services/categoriaService';
import { lugarService } from '../../services/lugarService';
import { usuarioService } from '../../services/usuarioService';
import { memoryOptimizer } from '../../utils/memoryOptimizer';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoriaId: '',
    usuarioId: user?.id || '',
    cep: '',
    rua: '',
    bairro: '',
    numero: '',
    latitude: '',
    longitude: '',
    publica: true,
    valor: 0,
    fotos: ['', '', '']
  });
  
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  const [locationInfo, setLocationInfo] = useState('');
  const [errors, setErrors] = useState({});
  const [photoError, setPhotoError] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadCategorias();
      loadUsuarios();
    }
  }, [isOpen]);

  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({ ...prev, usuarioId: user.id }));
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadUsuarios = async () => {
    try {
      const data = await usuarioService.listar();
      setUsuarios(data);
      // Usar usuário logado
      if (user?.id) {
        setFormData(prev => ({ ...prev, usuarioId: user.id }));
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const formatCep = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return numbers.replace(/(\d{5})(\d{1,3})/, '$1-$2');
  };

  const handleInputChange = (field, value) => {
    if (field === 'cep') {
      const formattedCep = formatCep(value);
      const numbersOnly = formattedCep.replace(/\D/g, '');
      
      setFormData(prev => ({
        ...prev,
        [field]: formattedCep
      }));
      
      if (numbersOnly.length === 8) {
        debouncedFetchAddress(numbersOnly);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lon
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
    }
  };

  const fetchAddressByCep = async (cep) => {
    try {
      // Usar API alternativa que não tem problema de CORS
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      const data = await response.json();
      
      if (data && !data.error) {
        const rua = data.street || '';
        const bairro = data.neighborhood || '';
        const cidade = data.city || '';
        const estado = data.state || '';
        
        setFormData(prev => ({
          ...prev,
          rua,
          bairro
        }));
        
        updateLocationInfo(rua, cidade, estado);
        
        if (rua && cidade && estado) {
          fetchCoordinates(`${rua}, ${cidade}, ${estado}`);
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

  const debouncedFetchAddress = (cep) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      fetchAddressByCep(cep);
    }, 500);
    setTimeoutId(newTimeoutId);
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
      categoriaId: '',
      usuarioId: user?.id || '',
      cep: '',
      rua: '',
      bairro: '',
      numero: '',
      latitude: '',
      longitude: '',
      publica: true,
      valor: 0,
      fotos: ['', '', '']
    });
    setLocationInfo('');
    setErrors({});
  };

  const handleClose = () => {
    memoryOptimizer.clearImageCache();
    
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
      categoriaId: 'Por favor, selecione uma categoria',
      cep: 'Por favor, insira o CEP',
      numero: 'Por favor, insira o número do local'
    };
    
    const newErrors = {};
    
    Object.keys(fieldMessages).forEach(field => {
      if (field === 'cep') {
        const numbersOnly = formData[field].replace(/\D/g, '');
        if (!numbersOnly || numbersOnly.length !== 8) {
          newErrors[field] = 'Por favor, insira um CEP válido com 8 dígitos';
        }
      } else if (field === 'categoriaId') {
        if (!formData[field] || formData[field] === '') {
          newErrors[field] = fieldMessages[field];
        }
      } else if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = fieldMessages[field];
      }
    });
    
    // Validar se pelo menos uma foto foi adicionada
    const temFoto = formData.fotos.some(foto => foto !== '' && foto !== null);
    if (!temFoto) {
      setPhotoError(true);
      newErrors.fotos = 'É obrigatório adicionar pelo menos uma imagem da pista';
    } else {
      setPhotoError(false);
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const processImagesForSave = async () => {
        const { processImagesForSave: processImages } = await import('../../utils/imageUtils');
        return await processImages(formData.fotos);
      };
      
      processImagesForSave().then((processedImages) => {
        const localizacao = [formData.rua, formData.bairro, formData.numero]
          .filter(item => item && item.trim())
          .join(', ');
        
        const categoriaEscolhida = categorias.find(cat => cat.id === formData.categoriaId);
        
        // Verificar nível de acesso do usuário
        const processarPista = async () => {
          const dadosPista = {
            nome: formData.nome,
            descricao: formData.descricao,
            tipo: formData.publica ? 'Pública' : 'Particular',
            cep: formData.cep,
            rua: formData.rua,
            bairro: formData.bairro,
            numero: formData.numero,
            latitude: formData.latitude,
            longitude: formData.longitude,
            categoriaId: formData.categoriaId,
            usuarioId: formData.usuarioId,
            valor: formData.valor || 0,
            foto1: processedImages[0]?.replace(/^data:image\/[a-z]+;base64,/, '') || null,
            foto2: processedImages[1]?.replace(/^data:image\/[a-z]+;base64,/, '') || null,
            foto3: processedImages[2]?.replace(/^data:image\/[a-z]+;base64,/, '') || null
          };
          
          if (user?.nivelAcesso === 'ADMIN' || user?.isOrganizador) {
            // Admin/Organizador: cria pista diretamente
            try {
              await lugarService.criar(dadosPista);
              console.log('Pista criada com sucesso!');
            } catch (error) {
              console.error('Erro ao criar pista:', error);
            }
          } else {
            // Usuário comum: envia solicitação
            try {
              await lugarService.solicitar(dadosPista);
              console.log('Solicitação enviada com sucesso!');
            } catch (error) {
              console.error('Erro ao enviar solicitação:', error);
            }
          }
        };
        
        processarPista();
        
        // Manter comportamento local para compatibilidade
        const newPista = {
          ...formData,
          id: Date.now(),
          localizacao,
          active: false,
          status: 'pendente',
          dataSolicitacao: new Date().toISOString(),
          fotos: processedImages,
          categoria: categoriaEscolhida?.nome || 'street'
        };
        
        onSave(newPista);
        resetForm();
        onClose();
        setShowSuccessModal(true);
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay 
          key="create-pista-modal" 
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
              <ModalTitle>
                {user?.isOrganizador || user?.nivelAcesso === 'ADMIN' ? 'Criar Nova Pista' : 'Solicitar Nova Pista'}
              </ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <PhotoSection style={{ border: photoError ? '2px solid #dc2626' : 'none' }}>
                {[0, 1, 2].map((index) => (
                  <PhotoUpload key={index} style={{ borderColor: photoError ? '#dc2626' : '#cbd5e0' }}>
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

                <FormGroup span={2}>
                  <Label>Categoria da Pista</Label>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {categorias.map(categoria => (
                      <label key={categoria.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: '2px solid #e2e8f0',
                        backgroundColor: formData.categoriaId === categoria.id ? '#667eea' : 'white',
                        color: formData.categoriaId === categoria.id ? 'white' : '#64748b',
                        transition: 'all 0.3s ease',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}>
                        <input
                          type="radio"
                          name="categoriaId"
                          value={categoria.id}
                          checked={formData.categoriaId === categoria.id}
                          onChange={(e) => handleInputChange('categoriaId', parseInt(e.target.value))}
                          style={{ display: 'none' }}
                        />
                        {categoria.nome}
                      </label>
                    ))}
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
                  <Label>CEP</Label>
                  <Input
                    type="text"
                    value={formData.cep}
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
                    placeholder="Rua será preenchida automaticamente pelo CEP"
                    style={{ backgroundColor: formData.rua ? '#f8fafc' : '#ffffff' }}
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
                    onChange={(e) => handleInputChange('bairro', e.target.value)}
                    placeholder="Bairro será preenchido automaticamente pelo CEP"
                    style={{ backgroundColor: formData.bairro ? '#f8fafc' : '#ffffff' }}
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
                  <Label>Latitude</Label>
                  <Input
                    type="text"
                    value={formData.latitude}
                    readOnly
                    style={{ backgroundColor: '#f8fafc' }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Longitude</Label>
                  <Input
                    type="text"
                    value={formData.longitude}
                    readOnly
                    style={{ backgroundColor: '#f8fafc' }}
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

              {!formData.publica && (
                <FormGroup>
                  <Label>Valor da Reserva (R$)</Label>
                  <Input
                    type="number"
                    value={formData.valor || ''}
                    onChange={(e) => handleInputChange('valor', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
              )}

              <FormGrid>
              </FormGrid>

              <ButtonGroup>
                <CancelButton onClick={handleClose}>Cancelar</CancelButton>
                <SaveButton onClick={handleSave}>
                  {user?.isOrganizador || user?.nivelAcesso === 'ADMIN' ? 'Criar Pista' : 'Solicitar Pista'}
                </SaveButton>
              </ButtonGroup>
            </ModalContent>
          </ModalContainer>
          
          <AnimatePresence>
            {showConfirmModal && (
              <ModalOverlay 
                key="confirm-modal" 
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
      
      <PistaRequestConfirmModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        isAdmin={user?.nivelAcesso === 'ADMIN' || user?.isOrganizador}
      />
    </AnimatePresence>
  );
};

export default CreatePistaModal;