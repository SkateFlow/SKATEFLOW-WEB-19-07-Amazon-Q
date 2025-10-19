import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiCamera, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import { lugarService } from '../../services/lugarService';
import { eventoService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
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
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #1a237e;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
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
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const PhotoSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
`;

const PhotoUpload = styled.div`
  min-width: 120px;
  height: 120px;
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.hasImage ? 'transparent' : '#ffffff'};

  &:hover {
    border-color: #667eea;
    background: ${props => props.hasImage ? 'transparent' : '#f7fafc'};
  }
`;

const PhotoPreview = styled.img`
  width: 120px;
  height: 120px;
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
  text-align: center;
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
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    info: '',
    dataInicio: '',
    dataFim: '',
    lugarId: '',
    fotos: [null, null, null]
  });
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLugares();
    }
  }, [isOpen]);

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

  const handlePhotoChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFotos = [...formData.fotos];
        newFotos[index] = e.target.result;
        setFormData(prev => ({ ...prev, fotos: newFotos }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const savedUser = localStorage.getItem('skateflow_user');
      if (!savedUser) {
        alert('Você precisa estar logado para criar um evento');
        return;
      }

      const userData = JSON.parse(savedUser);
      
      const eventoData = {
        nome: formData.nome,
        info: formData.info,
        dataInicio: new Date(formData.dataInicio).toISOString(),
        dataFim: new Date(formData.dataFim).toISOString(),
        statusEvento: user?.isOrganizador ? 'ativado' : 'pendente',
        usuario_id: { id: userData.id },
        lugar_id: { id: parseInt(formData.lugarId) },
        fotos: formData.fotos.filter(foto => foto),
        dataCriacao: new Date().toISOString(),
        criadoPor: userData.nome
      };

      if (user?.isOrganizador) {
        // Organizador: cria evento diretamente ativo
        await eventoService.criar(eventoData);
        alert('Evento criado com sucesso!');
      } else {
        // Usuário comum: adiciona à lista de pendentes
        const eventoComId = { ...eventoData, id: Date.now() };
        const eventosPendentes = JSON.parse(localStorage.getItem('eventosPendentes') || '[]');
        eventosPendentes.push(eventoComId);
        localStorage.setItem('eventosPendentes', JSON.stringify(eventosPendentes));
        alert('Solicitação de evento enviada para aprovação!');
      }

      onSave(eventoData);
      onClose();
      
      // Reset form
      setFormData({
        nome: '',
        info: '',
        dataInicio: '',
        dataFim: '',
        lugarId: '',
        fotos: [null, null, null]
      });

    } catch (error) {
      alert(typeof error === 'string' ? error : 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
            <FormGrid>
              <FormGroup className="full-width">
                <Label>Nome do Evento</Label>
                <Input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Digite o nome do evento"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label><FiCalendar size={16} /> Data de Início</Label>
                <Input
                  type="datetime-local"
                  value={formData.dataInicio}
                  onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label><FiClock size={16} /> Data de Fim</Label>
                <Input
                  type="datetime-local"
                  value={formData.dataFim}
                  onChange={(e) => handleInputChange('dataFim', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup className="full-width">
                <Label><FiMapPin size={16} /> Local do Evento</Label>
                <Select
                  value={formData.lugarId}
                  onChange={(e) => handleInputChange('lugarId', e.target.value)}
                  required
                >
                  <option value="">Selecione um local</option>
                  {lugares.map(lugar => (
                    <option key={lugar.id} value={lugar.id}>
                      {lugar.nome} - {lugar.rua && lugar.bairro ? `${lugar.rua}, ${lugar.bairro}` : lugar.cep}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup className="full-width">
                <Label>Descrição</Label>
                <TextArea
                  value={formData.info}
                  onChange={(e) => handleInputChange('info', e.target.value)}
                  placeholder="Descreva o evento..."
                  required
                />
              </FormGroup>
            </FormGrid>

            <Label>Fotos do Evento (opcional)</Label>
            <PhotoSection>
              {[0, 1, 2].map(index => (
                <PhotoUpload
                  key={index}
                  hasImage={formData.fotos[index]}
                  onClick={() => document.getElementById(`photo-${index}`).click()}
                >
                  {formData.fotos[index] ? (
                    <PhotoPreview src={formData.fotos[index]} alt={`Foto ${index + 1}`} />
                  ) : (
                    <PhotoLabel>
                      <FiCamera size={24} />
                      <span>Foto {index + 1}</span>
                    </PhotoLabel>
                  )}
                  <PhotoInput
                    id={`photo-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(index, e.target.files[0])}
                  />
                </PhotoUpload>
              ))}
            </PhotoSection>

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
    </ModalOverlay>
  );
};

export default CreateEventModal;