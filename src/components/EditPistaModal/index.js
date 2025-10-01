import React, { useState } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
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

  // Update form data when pista changes
  React.useEffect(() => {
    if (pista) {
      setFormData({
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
      });
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

  const handleSave = () => {
    onSave({ ...pista, ...formData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Editar Pista</ModalTitle>
          <CloseButton onClick={onClose}>
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
            </FormGroup>

            <FormGroup>
              <Label>Número do Local</Label>
              <Input
                type="text"
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                placeholder="Número"
              />
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
            </FormGroup>

            <FormGroup>
              <Label>Longitude</Label>
              <Input
                type="text"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                placeholder="-46.633308"
              />
            </FormGroup>
          </FormGrid>

          <ButtonGroup>
            <CancelButton onClick={onClose}>Cancelar</CancelButton>
            <SaveButton onClick={handleSave}>Salvar Alterações</SaveButton>
          </ButtonGroup>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditPistaModal;