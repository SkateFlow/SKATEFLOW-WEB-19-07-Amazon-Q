import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiCamera, FiMapPin, FiCalendar, FiClock, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { lugarService } from '../../services/lugarService';
import { eventoService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import EventRequestConfirmModal from '../EventRequestConfirmModal';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  color: #1a237e;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #1a237e;
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 0 24px 24px 24px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.hasError ? '#dc2626' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#667eea'};
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid ${props => props.hasError ? '#dc2626' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#667eea'};
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid ${props => props.hasError ? '#dc2626' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#667eea'};
  }
`;

const PhotoSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: ${props => props.hasError ? '2px solid #dc2626' : '1px solid #e2e8f0'};
`;

const PhotoUpload = styled.div`
  position: relative;
  width: 200px;
  height: 150px;
  border: 2px dashed ${props => props.hasError ? '#dc2626' : '#cbd5e0'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.hasImage ? 'transparent' : '#ffffff'};
  overflow: hidden;

  &:hover {
    border-color: ${props => props.hasError ? '#dc2626' : '#667eea'};
    background: ${props => props.hasImage ? 'transparent' : '#f7fafc'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const PhotoPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const PhotoInput = styled.input`
  display: none;
`;

const PhotoLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  
  svg {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid;

  ${props => props.primary ? `
    background: #1a237e;
    color: white;
    border-color: #1a237e;
    
    &:hover {
      background: #303f9f;
      border-color: #303f9f;
    }
  ` : `
    background: transparent;
    color: #64748b;
    border-color: #e2e8f0;
    
    &:hover {
      background: #f1f5f9;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CreateEventModal = ({ isOpen, onClose, onSave }) => {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    info: '',
    dataInicio: '',
    dataFim: '',
    lugarId: '',
    linkSite: '',
    foto: null
  });
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLugares();
    }
  }, [isOpen]);

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

  const loadLugares = async () => {
    try {
      const data = await lugarService.listar();
      const lugaresAtivos = data.filter(lugar => lugar.statusPista === 'ativada');
      setLugares(lugaresAtivos);
    } catch (error) {
      console.error('Erro ao carregar lugares:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (file) => {
    if (file) {
      // Verificar tamanho do arquivo (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Imagem muito grande. Tamanho máximo: 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Redimensionar se necessário (max 800px)
          let { width, height } = img;
          const maxSize = 800;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Comprimir para JPEG com qualidade 0.6
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          
          setFormData(prev => ({ ...prev, foto: compressedDataUrl }));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar campos obrigatórios
      const newErrors = {};
      
      if (!formData.nome.trim()) {
        newErrors.nome = 'Nome do evento é obrigatório';
      }
      
      if (!formData.info.trim()) {
        newErrors.info = 'Descrição é obrigatória';
      } else if (formData.info.length > 300) {
        newErrors.info = 'Descrição deve ter no máximo 300 caracteres';
      }
      
      if (!formData.dataInicio) {
        newErrors.dataInicio = 'Data de início é obrigatória';
      }
      
      if (!formData.dataFim) {
        newErrors.dataFim = 'Data de fim é obrigatória';
      }
      
      if (!formData.lugarId) {
        newErrors.lugarId = 'Selecione uma pista';
      }
      
      // Validar se foto foi adicionada
      if (!formData.foto) {
        setPhotoError(true);
        newErrors.foto = 'É obrigatório adicionar uma foto';
      } else {
        setPhotoError(false);
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length > 0) {
        setLoading(false);
        return;
      }
      
      const processarEvento = async () => {
        if (user?.nivelAcesso === 'ADMIN' || user?.isOrganizador) {
          // Admin/Organizador: cria evento diretamente
          try {
            const eventoData = {
              nome: formData.nome,
              info: formData.info,
              dataInicio: new Date(formData.dataInicio).toISOString(),
              dataFim: new Date(formData.dataFim).toISOString(),
              statusEvento: 'ativado',
              linkSite: formData.linkSite || null,
              usuario_id: { id: user.id },
              lugar_id: { id: parseInt(formData.lugarId) },
              foto1: formData.foto ? formData.foto.split(',')[1] : null
            };
            await eventoService.criar(eventoData);
            console.log('Evento criado com sucesso!');
          } catch (error) {
            console.error('Erro ao criar evento:', error);
          }
        } else {
          // Usuário comum: envia solicitação
          try {
            const eventoData = {
              nome: formData.nome,
              info: formData.info,
              dataInicio: new Date(formData.dataInicio).toISOString(),
              dataFim: new Date(formData.dataFim).toISOString(),
              linkSite: formData.linkSite || null,
              usuario_id: { id: user.id },
              lugar_id: { id: parseInt(formData.lugarId) },
              foto1: formData.foto ? formData.foto.split(',')[1] : null
            };
            await eventoService.solicitar(eventoData);
            console.log('Solicitação enviada com sucesso!');
          } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
          }
        }
      };
      
      await processarEvento();
      
      // Manter comportamento local para compatibilidade
      const eventoLocal = {
        ...formData,
        id: Date.now(),
        status: 'pendente',
        dataSolicitacao: new Date().toISOString(),
        criadoPor: user.nome
      };
      
      onSave(eventoLocal);
      onClose();
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        nome: '',
        info: '',
        dataInicio: '',
        dataFim: '',
        lugarId: '',
        linkSite: '',
        foto: null
      });
      setErrors({});

    } catch (error) {
      console.error('Erro ao processar evento:', error);
      alert(typeof error === 'string' ? error : 'Erro ao processar evento');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  
  if (authLoading) {
    return (
      <ModalOverlay>
        <ModalContent>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Carregando...
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Criar Novo Evento</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <PhotoSection hasError={photoError}>
              <PhotoUpload
                hasImage={formData.foto}
                hasError={photoError}
              >
                {formData.foto ? (
                  <PhotoPreview src={formData.foto} alt="Foto do evento" />
                ) : (
                  <>
                    <FiCamera size={24} />
                    <span>Adicionar Foto</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(e.target.files[0])}
                />
              </PhotoUpload>
            </PhotoSection>

            <FormGrid>
              <FormGroup className="full-width">
                <Label>Nome do Evento</Label>
                <Input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Digite o nome do evento"
                  hasError={errors.nome}
                  required
                />
                {errors.nome && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.nome}</div>}
              </FormGroup>

              <FormGroup>
                <Label><FiCalendar size={16} /> Data de Início</Label>
                <Input
                  type="datetime-local"
                  value={formData.dataInicio}
                  onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                  hasError={errors.dataInicio}
                  required
                />
                {errors.dataInicio && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.dataInicio}</div>}
              </FormGroup>

              <FormGroup>
                <Label><FiClock size={16} /> Data de Fim</Label>
                <Input
                  type="datetime-local"
                  value={formData.dataFim}
                  onChange={(e) => handleInputChange('dataFim', e.target.value)}
                  hasError={errors.dataFim}
                  required
                />
                {errors.dataFim && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.dataFim}</div>}
              </FormGroup>

              <FormGroup className="full-width">
                <Label><FiMapPin size={16} /> Local do Evento</Label>
                <div style={{ position: 'relative', width: '100%' }} data-dropdown>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${errors.lugarId ? '#dc2626' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '16px',
                      background: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ color: formData.lugarId ? '#1a237e' : '#94a3b8' }}>
                      {formData.lugarId 
                        ? lugares.find(l => l.id.toString() === formData.lugarId.toString())?.nome || 'Selecione um local'
                        : 'Selecione um local'
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
                          overflow: 'hidden',
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}
                      >
                        {lugares.map((lugar) => (
                          <div
                            key={lugar.id}
                            onClick={() => {
                              handleInputChange('lugarId', lugar.id.toString());
                              setIsDropdownOpen(false);
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: '#4a5568',
                              fontWeight: '500',
                              transition: 'background 0.2s ease',
                              background: formData.lugarId === lugar.id.toString() ? '#f7fafc' : 'white',
                              borderBottom: '1px solid #f1f5f9'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f7fafc'}
                            onMouseLeave={(e) => e.target.style.background = formData.lugarId === lugar.id.toString() ? '#f7fafc' : 'white'}
                          >
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>{lugar.nome}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {lugar.rua && lugar.bairro ? `${lugar.rua}, ${lugar.bairro}` : lugar.cep}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors.lugarId && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.lugarId}</div>}
              </FormGroup>

              <FormGroup className="full-width">
                <Label>Descrição</Label>
                <TextArea
                  value={formData.info}
                  onChange={(e) => handleInputChange('info', e.target.value)}
                  placeholder="Descreva o evento..."
                  maxLength={300}
                  hasError={errors.info}
                  required
                />
                <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>
                  {formData.info.length}/300 caracteres
                </div>
                {errors.info && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.info}</div>}
              </FormGroup>

              <FormGroup className="full-width">
                <Label>Link do Site do Evento (opcional)</Label>
                <Input
                  type="url"
                  value={formData.linkSite}
                  onChange={(e) => handleInputChange('linkSite', e.target.value)}
                  placeholder="https://exemplo.com"
                />
              </FormGroup>
            </FormGrid>


            <ButtonGroup>
              <Button type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" primary disabled={loading}>
                {loading ? 'Criando...' : 'Criar Evento'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContent>
      
      <EventRequestConfirmModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        isOrganizer={user?.nivelAcesso === 'ADMIN' || user?.isOrganizador}
      />
    </ModalOverlay>
  );
};

export default CreateEventModal;