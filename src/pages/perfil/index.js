import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUser, FiCalendar, FiMapPin, FiEye, FiEyeOff, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { usuarioService } from '../../services/usuarioService';

const Container = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  min-height: 100vh;
  display: flex;
`;

const Sidebar = styled.div`
  width: 280px;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 5px 0 40px 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  margin-bottom: 25px;
  margin-top: 5px;
  
  &:hover {
    color: #1a237e;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 30px 30px;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
`;

const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.bgColor || '#667eea'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 32px;
  font-weight: 600;
  color: white;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileName = styled.h2`
  color: #1a237e;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
`;

const ProfileEmail = styled.p`
  color: #64748b;
  font-size: 14px;
  margin: 0;
`;

const SidebarMenu = styled.div`
  padding: 30px 0;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 16px 30px;
  background: ${props => props.active ? '#f1f5f9' : 'transparent'};
  border: none;
  border-left: ${props => props.active ? '4px solid #1a237e' : '4px solid transparent'};
  text-align: left;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.active ? '#1a237e' : '#64748b'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: #f1f5f9;
    color: #1a237e;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
`;

const ContentHeader = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #1a237e;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 18px;
  margin: 0;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #1a237e 100%);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

const PasswordGroup = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
`;

const PhotoSection = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const PhotoPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.bgColor || '#667eea'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 600;
  color: white;
  overflow: hidden;
`;

const PhotoUpload = styled.input`
  display: none;
`;

const PhotoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: #5a67d8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  align-items: center;
`;

const InlineNotification = styled.div`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-right: auto;
  animation: ${props => props.isExiting ? 'slideOut' : 'slideIn'} 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-20px);
    }
  }
  
  ${props => props.success ? `
    background: #dcfce7;
    border: 1px solid #bbf7d0;
    color: #166534;
  ` : `
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #dc2626;
  `}
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

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  color: #dc2626;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  color: #166534;
  font-size: 14px;
`;

const Perfil = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    novaSenha: '',
    confirmarSenha: '',
    foto: null
  });
  const [showPasswords, setShowPasswords] = useState({
    nova: false,
    confirmar: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const getAvatarColor = (name) => {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, foto: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.nome.trim()) {
        throw 'Nome é obrigatório';
      }

      if (formData.novaSenha) {
        if (formData.novaSenha.length < 8) {
          throw 'Nova senha deve ter pelo menos 8 caracteres';
        }
        if (!/[A-Z]/.test(formData.novaSenha)) {
          throw 'Nova senha deve conter pelo menos uma letra maiúscula';
        }
        if (formData.novaSenha !== formData.confirmarSenha) {
          throw 'Confirmação de senha não confere';
        }
      }

      const updateData = {
        nome: formData.nome,
        isAdmin: user.nivelAcesso === 'ADMIN',
        isActive: user.statusUsuario === 'ATIVO'
      };
      
      if (formData.foto !== null) {
        updateData.foto = formData.foto;
      }

      await usuarioService.atualizar(user.id, updateData);

      if (formData.novaSenha) {
        await usuarioService.alterarSenha(user.id, { senha: formData.novaSenha });
      }

      const updatedUser = { ...user, nome: formData.nome, foto: formData.foto };
      login(updatedUser);

      setSuccess('Perfil atualizado com sucesso!');
      setShowNotification(true);
      setFormData(prev => ({
        ...prev,
        novaSenha: '',
        confirmarSenha: ''
      }));
      
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setShowNotification(false);
          setIsExiting(false);
          setSuccess('');
        }, 300);
      }, 3000);

    } catch (err) {
      setError(typeof err === 'string' ? err : 'Erro ao atualizar perfil');
      setShowNotification(true);
      
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setShowNotification(false);
          setIsExiting(false);
          setError('');
        }, 300);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <Card>
            <form onSubmit={handleSubmit}>

              <PhotoSection>
                <PhotoPreview bgColor={getAvatarColor(formData.nome)}>
                  {formData.foto ? (
                    <ProfileImage src={formData.foto} alt="Perfil" />
                  ) : (
                    formData.nome?.charAt(0)?.toUpperCase() || <FiUser />
                  )}
                </PhotoPreview>
                <div>
                  <h3 style={{ margin: '0 0 8px', color: '#1a237e' }}>Foto de Perfil</h3>
                  <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '14px' }}>
                    Escolha uma imagem para seu perfil
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <PhotoButton type="button" onClick={() => document.getElementById('photo-upload').click()}>
                      <FiCamera />
                      Alterar Foto
                    </PhotoButton>
                    {(formData.foto || user?.foto) && (
                      <PhotoButton 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, foto: '' }))}
                        style={{ background: '#dc2626' }}
                      >
                        Remover Foto
                      </PhotoButton>
                    )}
                  </div>
                  <PhotoUpload
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
              </PhotoSection>

              <FormGrid>
                <FormGroup>
                  <Label>Nome</Label>
                  <Input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Seu nome"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    disabled
                    style={{ background: '#f8fafc' }}
                  />
                </FormGroup>



                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>Nova Senha</Label>
                  <PasswordGroup>
                    <Input
                      type={showPasswords.nova ? "text" : "password"}
                      value={formData.novaSenha}
                      onChange={(e) => handleInputChange('novaSenha', e.target.value)}
                      placeholder="Digite a nova senha"
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, nova: !prev.nova }))}
                    >
                      {showPasswords.nova ? <FiEyeOff /> : <FiEye />}
                    </PasswordToggle>
                  </PasswordGroup>
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>Confirmar Nova Senha</Label>
                  <PasswordGroup>
                    <Input
                      type={showPasswords.confirmar ? "text" : "password"}
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                      placeholder="Confirme a nova senha"
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirmar: !prev.confirmar }))}
                    >
                      {showPasswords.confirmar ? <FiEyeOff /> : <FiEye />}
                    </PasswordToggle>
                  </PasswordGroup>
                </FormGroup>
              </FormGrid>

              <ButtonGroup>
                {(success || error) && showNotification && (
                  <InlineNotification success={!!success} isExiting={isExiting}>
                    {success || error}
                  </InlineNotification>
                )}
                <Button type="button" onClick={() => window.history.back()}>
                  Cancelar
                </Button>
                <Button type="submit" primary disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </ButtonGroup>
            </form>
          </Card>
        );

      case 'eventos':
        return (
          <Card>
            <h3 style={{ color: '#1a237e', marginBottom: '24px' }}>Meus Eventos</h3>
            <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
              Funcionalidade em desenvolvimento
            </p>
          </Card>
        );

      case 'pistas':
        return (
          <Card>
            <h3 style={{ color: '#1a237e', marginBottom: '24px' }}>Minhas Pistas</h3>
            <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
              Funcionalidade em desenvolvimento
            </p>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Sidebar>
        <BackButton onClick={() => window.history.back()}>
          <FiArrowLeft />
          Voltar
        </BackButton>
        <SidebarHeader>
          <ProfileAvatar bgColor={getAvatarColor(user?.nome)}>
            {user?.foto ? (
              <ProfileImage src={user.foto} alt={user.nome} />
            ) : (
              user?.nome?.charAt(0)?.toUpperCase() || <FiUser />
            )}
          </ProfileAvatar>
          <ProfileName>{user?.nome}</ProfileName>
          <ProfileEmail>{user?.email}</ProfileEmail>
        </SidebarHeader>

        <SidebarMenu>
          <MenuItem
            active={activeTab === 'perfil'}
            onClick={() => setActiveTab('perfil')}
          >
            <FiUser />
            Meu Perfil
          </MenuItem>
          <MenuItem
            active={activeTab === 'eventos'}
            onClick={() => setActiveTab('eventos')}
          >
            <FiCalendar />
            Meus Eventos
          </MenuItem>
          <MenuItem
            active={activeTab === 'pistas'}
            onClick={() => setActiveTab('pistas')}
          >
            <FiMapPin />
            Minhas Pistas
          </MenuItem>
        </SidebarMenu>
      </Sidebar>

      <Content>
        <ContentHeader>
          <Title>
            {activeTab === 'perfil' && 'Meu Perfil'}
            {activeTab === 'eventos' && 'Meus Eventos'}
            {activeTab === 'pistas' && 'Minhas Pistas'}
          </Title>
          <Subtitle>
            {activeTab === 'perfil' && 'Gerencie suas informações pessoais'}
            {activeTab === 'eventos' && 'Eventos que você criou'}
            {activeTab === 'pistas' && 'Pistas que você adicionou'}
          </Subtitle>
        </ContentHeader>

        {renderContent()}
      </Content>
    </Container>
  );
};

export default Perfil;