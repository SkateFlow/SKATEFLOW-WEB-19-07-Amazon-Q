import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';
import SidebarOrganizador from '../../../components/SidebarOrganizador';
import { useAuth } from '../../../context/AuthContext';
import { usuarioService } from '../../../services/usuarioService';
import { organizadorService } from '../../../services/organizadorService';

const Container = styled.div`
  background: 
    radial-gradient(circle at 20% 80%, #d0e6ffff 0%, transparent 25%),
    radial-gradient(circle at 80% 20%, #c4e0ffff 0%, transparent 25%),
    radial-gradient(circle at 40% 40%, #ffffff 0%, transparent 25%),
    #f8fafc;
  min-height: 100vh;
`;

const Content = styled.div`
  margin-left: 250px;
  padding: 40px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #1a237e;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 16px;
  margin: 0;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  color: #1a237e;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1a237e;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
  }
  
  &:disabled {
    background: #f8fafc;
    color: #64748b;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.primary ? `
    background: #1a237e;
    color: white;
    
    &:hover {
      background: #303f9f;
    }
  ` : `
    background: #e2e8f0;
    color: #64748b;
    
    &:hover {
      background: #cbd5e0;
    }
  `}
`;

const PerfilOrganizador = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [organizadorData, setOrganizadorData] = useState(null);
  const [formData, setFormData] = useState({
    // Dados do usuário
    nome: '',
    email: '',
    // Dados do organizador
    nomeOrganizador: '',
    cpf_cnpj: '',
    telefone: '',
    logradouro: '',
    numResidencia: '',
    cep: '',
    bairro: '',
    cidade: '',
    uf: '',
    complemento: ''
  });

  useEffect(() => {
    if (user) {
      loadOrganizadorData();
    }
  }, [user]);

  const loadOrganizadorData = async () => {
    try {
      const organizadores = await organizadorService.listar();
      const organizador = organizadores.find(org => org.usuario_id?.id === user.id);
      
      if (organizador) {
        setOrganizadorData(organizador);
        setFormData({
          nome: user.nome || '',
          email: user.email || '',
          nomeOrganizador: organizador.nome || '',
          cpf_cnpj: organizador.cpf_cnpj || '',
          telefone: organizador.telefone || '',
          logradouro: organizador.logradouro || '',
          numResidencia: organizador.numResidencia || '',
          cep: organizador.cep || '',
          bairro: organizador.bairro || '',
          cidade: organizador.cidade || '',
          uf: organizador.uf || '',
          complemento: organizador.complemento || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do organizador:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Atualizar dados do usuário se necessário
      if (formData.nome !== user.nome || formData.email !== user.email) {
        await usuarioService.atualizar(user.id, {
          nome: formData.nome,
          email: formData.email
        });
      }

      // Atualizar dados do organizador
      if (organizadorData) {
        const organizadorUpdate = {
          nome: formData.nomeOrganizador,
          cpf_cnpj: formData.cpf_cnpj,
          telefone: formData.telefone,
          logradouro: formData.logradouro,
          numResidencia: formData.numResidencia,
          cep: formData.cep,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
          complemento: formData.complemento,
          usuario_id: { id: user.id }
        };
        
        // Aqui você precisaria implementar o método update no organizadorService
        console.log('Dados para atualizar:', organizadorUpdate);
      }

      setEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar perfil: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SidebarOrganizador />
      <Content>
        <Header>
          <Title>Meu Perfil</Title>
          <Subtitle>Gerencie suas informações pessoais e de organizador</Subtitle>
        </Header>

        <ProfileGrid>
          <ProfileSection>
            <SectionTitle>Dados Pessoais</SectionTitle>
            
            <FormGroup>
              <Label>Nome Completo</Label>
              <Input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>

            <FormGroup>
              <Label>Nome do Organizador</Label>
              <Input
                type="text"
                value={formData.nomeOrganizador}
                onChange={(e) => handleInputChange('nomeOrganizador', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>

            <FormGroup>
              <Label>CNPJ/CPF</Label>
              <Input
                type="text"
                value={formData.cpf_cnpj}
                onChange={(e) => handleInputChange('cpf_cnpj', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>

            <FormGroup>
              <Label>Telefone</Label>
              <Input
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>


          </ProfileSection>

          <ProfileSection>
            <SectionTitle>Endereço</SectionTitle>
            
            <FormGroup>
              <Label>CEP</Label>
              <Input
                type="text"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>

            <FormGroup>
              <Label>Logradouro</Label>
              <Input
                type="text"
                value={formData.logradouro}
                onChange={(e) => handleInputChange('logradouro', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>

            <FormGroup>
              <Label>Número</Label>
              <Input
                type="text"
                value={formData.numResidencia}
                onChange={(e) => handleInputChange('numResidencia', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>

            <FormGroup>
              <Label>Bairro</Label>
              <Input
                type="text"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>

            <FormGroup>
              <Label>Cidade</Label>
              <Input
                type="text"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>

            <FormGroup>
              <Label>UF</Label>
              <Input
                type="text"
                value={formData.uf}
                onChange={(e) => handleInputChange('uf', e.target.value)}
                disabled={!editing}
                maxLength="2"
              />
            </FormGroup>

            <FormGroup>
              <Label>Complemento</Label>
              <Input
                type="text"
                value={formData.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
                disabled={!editing}
              />
            </FormGroup>
          </ProfileSection>
        </ProfileGrid>

        <ButtonGroup>
          {editing ? (
            <>
              <Button onClick={() => setEditing(false)}>
                <FiX size={16} />
                Cancelar
              </Button>
              <Button primary onClick={handleSave} disabled={loading}>
                <FiSave size={16} />
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          ) : (
            <Button primary onClick={() => setEditing(true)}>
              <FiEdit size={16} />
              Editar Perfil
            </Button>
          )}
        </ButtonGroup>
      </Content>
    </Container>
  );
};

export default PerfilOrganizador;