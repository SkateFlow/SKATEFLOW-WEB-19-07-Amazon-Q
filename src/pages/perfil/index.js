import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUser, FiCalendar, FiMapPin, FiEye, FiEyeOff, FiCamera, FiArrowLeft, FiEdit, FiTrash, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { usuarioService } from '../../services/usuarioService';
import { eventoService } from '../../services/eventService';
import { lugarService } from '../../services/lugarService';
import ConfirmModal from '../../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  background: 
    radial-gradient(circle at 20% 80%, #d0e6ffff 0%, transparent 25%),
    radial-gradient(circle at 80% 20%, #c4e0ffff 0%, transparent 25%),
    radial-gradient(circle at 40% 40%, #ffffff 0%, transparent 25%),
    #f8fafc;
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
  z-index: 1;
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

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ItemCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ItemTitle = styled.h4`
  color: #1a237e;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
`;

const ItemDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  margin: 0 0 16px;
  line-height: 1.4;
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.active ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.active ? '#166534' : '#92400e'};
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.edit {
    background: #e0f2fe;
    color: #0277bd;
    
    &:hover {
      background: #b3e5fc;
    }
  }
  
  &.delete {
    background: #fee2e2;
    color: #dc2626;
    
    &:hover {
      background: #fecaca;
    }
  }
  
  &.toggle {
    background: #f3f4f6;
    color: #4b5563;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const Perfil = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionar organizadores para sua área específica
  useEffect(() => {
    if (user?.isOrganizador) {
      navigate('/organizador/perfil');
      return;
    }
  }, [user, navigate]);
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
  const [isEditing, setIsEditing] = useState(false);
  const [userEventos, setUserEventos] = useState([]);
  const [userPistas, setUserPistas] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', item: null });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || '',
        email: user.email || ''
      }));
      
      // Carregar foto do usuário
      if (user.id) {
        usuarioService.buscarFoto(user.id)
          .then(fotoBase64 => {
            if (fotoBase64) {
              setFormData(prev => ({
                ...prev,
                foto: `data:image/jpeg;base64,${fotoBase64}`
              }));
            }
          })
          .catch(() => {});
      }
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'eventos' && user?.id) {
      loadUserEventos();
    } else if (activeTab === 'pistas' && user?.id) {
      loadUserPistas();
    }
  }, [activeTab, user]);

  const loadUserEventos = async () => {
    setLoadingItems(true);
    try {
      const eventos = await eventoService.listar();
      const userEventos = eventos.filter(evento => 
        evento.usuario_id?.id === user.id || evento.usuario_id === user.id
      );
      setUserEventos(userEventos);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const loadUserPistas = async () => {
    setLoadingItems(true);
    try {
      const pistas = await lugarService.listar();
      console.log('Todas as pistas:', pistas);
      console.log('User ID atual:', user.id);
      
      const userPistas = pistas.filter(pista => {
        const isOwner = pista.usuario?.id === user.id || 
                       pista.usuarioId === user.id ||
                       pista.usuario_id?.id === user.id;
        
        console.log(`Pista ${pista.nome}:`, {
          pistaUsuarioId: pista.usuario?.id,
          pistaUsuarioIdDirect: pista.usuarioId,
          pistaUsuario_id: pista.usuario_id?.id,
          userIdAtual: user.id,
          isOwner
        });
        
        return isOwner;
      });
      
      console.log('Pistas filtradas para o usuário:', userPistas);
      setUserPistas(userPistas);
    } catch (error) {
      console.error('Erro ao carregar pistas:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleToggleEventoStatus = async (eventoId, currentStatus) => {
    try {
      const evento = userEventos.find(e => e.id === eventoId);
      if (!evento || (evento.usuario_id?.id !== user.id && evento.usuario_id !== user.id)) {
        alert('Você só pode alterar eventos que você criou');
        return;
      }
      const newStatus = currentStatus === 'ativado' ? 'inativo' : 'ativado';
      const eventoData = {
        ...evento,
        statusEvento: newStatus
      };
      await eventoService.atualizar(eventoId, eventoData);
      loadUserEventos();
    } catch (error) {
      console.error('Erro ao alterar status do evento:', error);
      alert('Erro ao alterar status do evento');
    }
  };

  const handleTogglePistaStatus = async (pistaId, currentStatus) => {
    try {
      const pista = userPistas.find(p => p.id === pistaId);
      if (!pista || (pista.usuario?.id !== user.id && pista.usuarioId !== user.id)) {
        alert('Você só pode alterar pistas que você criou');
        return;
      }
      const newStatus = currentStatus === 'ativada' ? 'inativa' : 'ativada';
      const pistaData = {
        ...pista,
        statusPista: newStatus
      };
      await lugarService.atualizar(pistaId, pistaData);
      loadUserPistas();
    } catch (error) {
      console.error('Erro ao alterar status da pista:', error);
      alert('Erro ao alterar status da pista');
    }
  };

  const handleDeleteEvento = (eventoId) => {
    const evento = userEventos.find(e => e.id === eventoId);
    if (!evento || (evento.usuario_id?.id !== user.id && evento.usuario_id !== user.id)) {
      alert('Você só pode excluir eventos que você criou');
      return;
    }
    setConfirmModal({
      isOpen: true,
      type: 'evento',
      item: evento
    });
  };

  const handleDeletePista = (pistaId) => {
    const pista = userPistas.find(p => p.id === pistaId);
    if (!pista || (pista.usuario?.id !== user.id && pista.usuarioId !== user.id)) {
      alert('Você só pode excluir pistas que você criou');
      return;
    }
    setConfirmModal({
      isOpen: true,
      type: 'pista',
      item: pista
    });
  };

  const handleEditItem = (item, type) => {
    setEditingItem({ ...item, type });
    if (type === 'evento') {
      setEditForm({
        nome: item.nome || '',
        info: item.info || '',
        dataInicio: item.dataInicio ? item.dataInicio.slice(0, 16) : '',
        dataFim: item.dataFim ? item.dataFim.slice(0, 16) : ''
      });
    } else {
      setEditForm({
        nome: item.nome || '',
        descricao: item.descricao || '',
        cep: item.cep || '',
        numero: item.numero || '',
        valor: item.valor || 0
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (editingItem.type === 'evento') {
        const eventoData = {
          ...editingItem,
          nome: editForm.nome,
          info: editForm.info,
          dataInicio: editForm.dataInicio,
          dataFim: editForm.dataFim
        };
        await eventoService.atualizar(editingItem.id, eventoData);
        loadUserEventos();
      } else {
        const pistaData = {
          ...editingItem,
          nome: editForm.nome,
          descricao: editForm.descricao,
          cep: editForm.cep,
          numero: editForm.numero,
          valor: parseFloat(editForm.valor) || 0
        };
        await lugarService.atualizar(editingItem.id, pistaData);
        loadUserPistas();
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar alterações');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmModal.type === 'evento') {
        await eventoService.deletar(confirmModal.item.id);
        loadUserEventos();
      } else {
        await lugarService.deletar(confirmModal.item.id);
        loadUserPistas();
      }
      setConfirmModal({ isOpen: false, type: '', item: null });
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

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

      await usuarioService.atualizar(user.id, updateData);

      if (formData.novaSenha) {
        await usuarioService.alterarSenha(user.id, { senha: formData.novaSenha });
      }

      // Salvar foto se foi alterada
      if (formData.foto && formData.foto !== user.foto) {
        const fotoBase64 = formData.foto.split(',')[1]; // Remove o prefixo data:image/...
        await usuarioService.salvarFoto(user.id, fotoBase64);
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
          setIsEditing(false); // Voltar para modo visualização após salvar
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
            {!isEditing ? (
              // Visualização das informações
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3 style={{ color: '#1a237e', margin: 0 }}>Informações do Perfil</h3>
                  <Button primary onClick={() => setIsEditing(true)}>
                    <FiEdit style={{ marginRight: '8px' }} />
                    Editar Perfil
                  </Button>
                </div>

                <PhotoSection style={{ marginTop: '24px' }}>
                  <PhotoPreview bgColor={getAvatarColor(formData.nome)}>
                    {formData.foto ? (
                      <ProfileImage src={formData.foto} alt="Perfil" />
                    ) : (
                      formData.nome?.charAt(0)?.toUpperCase() || <FiUser />
                    )}
                  </PhotoPreview>
                  <div>
                    <h3 style={{ margin: '0 0 8px', color: '#1a237e' }}>Foto de Perfil</h3>
                    <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>
                      {formData.foto ? 'Foto personalizada' : 'Usando inicial do nome'}
                    </p>
                  </div>
                </PhotoSection>

                <FormGrid>
                  <FormGroup>
                    <Label>Nome</Label>
                    <Input
                      type="text"
                      value={formData.nome}
                      disabled
                      style={{ background: '#f8fafc' }}
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

                  <FormGroup>
                    <Label>Nível de Acesso</Label>
                    <Input
                      type="text"
                      value={user?.nivelAcesso || 'USUARIO'}
                      disabled
                      style={{ background: '#f8fafc' }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Status da Conta</Label>
                    <Input
                      type="text"
                      value={user?.statusUsuario || 'ATIVO'}
                      disabled
                      style={{ background: '#f8fafc' }}
                    />
                  </FormGroup>
                </FormGrid>
              </>
            ) : (
              // Formulário de edição
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3 style={{ color: '#1a237e', margin: 0 }}>Editar Perfil</h3>
                  <Button onClick={() => {
                    setIsEditing(false);
                    setFormData(prev => ({
                      ...prev,
                      novaSenha: '',
                      confirmarSenha: ''
                    }));
                    setError('');
                    setSuccess('');
                  }}>
                    Cancelar
                  </Button>
                </div>

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
                  <Button type="button" onClick={() => {
                    setIsEditing(false);
                    setFormData(prev => ({
                      ...prev,
                      novaSenha: '',
                      confirmarSenha: ''
                    }));
                    setError('');
                    setSuccess('');
                  }}>
                    Cancelar
                  </Button>
                  <Button type="submit" primary disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </ButtonGroup>
              </form>
            )}
          </Card>
        );

      case 'eventos':
        return (
          <Card>
            <h3 style={{ color: '#1a237e', marginBottom: '24px' }}>Meus Eventos</h3>
            {loadingItems ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#64748b'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #e2e8f0',
                  borderTop: '3px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '16px'
                }} />
                <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: '500', margin: '0' }}>Carregando eventos...</p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : userEventos.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📅</EmptyIcon>
                <p style={{ fontSize: '18px', marginBottom: '8px', color: '#475569' }}>Nenhum evento encontrado</p>
                <p style={{ fontSize: '14px', margin: '0' }}>Você ainda não criou nenhum evento</p>
              </EmptyState>
            ) : (
              <ItemGrid>
                {userEventos.map(evento => (
                  <ItemCard key={evento.id}>
                    <ItemTitle>{evento.nome}</ItemTitle>
                    <ItemDescription>{evento.info}</ItemDescription>
                    <ItemMeta>
                      <StatusBadge active={evento.statusEvento === 'ativado'}>
                        {evento.statusEvento === 'ativado' ? 'Ativo' : 'Inativo'}
                      </StatusBadge>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {evento.dataInicio ? new Date(evento.dataInicio).toLocaleDateString('pt-BR') : 'Data não informada'}
                      </span>
                    </ItemMeta>
                    <ItemActions>
                      <ActionButton 
                        className="edit"
                        onClick={() => handleEditItem(evento, 'evento')}
                      >
                        <FiEdit />
                        Editar
                      </ActionButton>
                      <ActionButton 
                        className="toggle"
                        onClick={() => handleToggleEventoStatus(evento.id, evento.statusEvento)}
                      >
                        {evento.statusEvento === 'ativado' ? <FiToggleRight /> : <FiToggleLeft />}
                        {evento.statusEvento === 'ativado' ? 'Desativar' : 'Ativar'}
                      </ActionButton>
                      <ActionButton 
                        className="delete"
                        onClick={() => handleDeleteEvento(evento.id)}
                      >
                        <FiTrash />
                        Excluir
                      </ActionButton>
                    </ItemActions>
                  </ItemCard>
                ))}
              </ItemGrid>
            )}
          </Card>
        );

      case 'pistas':
        return (
          <Card>
            <h3 style={{ color: '#1a237e', marginBottom: '24px' }}>Minhas Pistas</h3>
            {loadingItems ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#64748b'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #e2e8f0',
                  borderTop: '3px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '16px'
                }} />
                <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: '500', margin: '0' }}>Carregando pistas...</p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : userPistas.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🛹</EmptyIcon>
                <p style={{ fontSize: '18px', marginBottom: '8px', color: '#475569' }}>Nenhuma pista encontrada</p>
                <p style={{ fontSize: '14px', margin: '0' }}>Você ainda não adicionou nenhuma pista</p>
              </EmptyState>
            ) : (
              <ItemGrid>
                {userPistas.map(pista => (
                  <ItemCard key={pista.id}>
                    <ItemTitle>{pista.nome}</ItemTitle>
                    <ItemDescription>{pista.descricao}</ItemDescription>
                    <ItemMeta>
                      <StatusBadge active={pista.statusPista === 'ativada'}>
                        {pista.statusPista === 'ativada' ? 'Ativa' : 'Inativa'}
                      </StatusBadge>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {pista.categoria?.nome || 'Categoria não informada'}
                      </span>
                    </ItemMeta>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                      📍 {pista.rua && pista.bairro ? `${pista.rua}, ${pista.bairro}` : pista.cep || 'Endereço não informado'}
                    </div>
                    <ItemActions>
                      <ActionButton 
                        className="edit"
                        onClick={() => handleEditItem(pista, 'pista')}
                      >
                        <FiEdit />
                        Editar
                      </ActionButton>
                      <ActionButton 
                        className="toggle"
                        onClick={() => handleTogglePistaStatus(pista.id, pista.statusPista)}
                      >
                        {pista.statusPista === 'ativada' ? <FiToggleRight /> : <FiToggleLeft />}
                        {pista.statusPista === 'ativada' ? 'Desativar' : 'Ativar'}
                      </ActionButton>
                      <ActionButton 
                        className="delete"
                        onClick={() => handleDeletePista(pista.id)}
                      >
                        <FiTrash />
                        Excluir
                      </ActionButton>
                    </ItemActions>
                  </ItemCard>
                ))}
              </ItemGrid>
            )}
          </Card>
        );

      default:
        return null;
    }
  };

  // Não renderizar nada se for organizador (será redirecionado)
  if (user?.isOrganizador) {
    return null;
  }

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
      {editingItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 10000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            width: '90%', maxWidth: '500px', maxHeight: '80vh', overflow: 'auto'
          }}>
            <h3 style={{ color: '#1a237e', marginBottom: '24px' }}>
              Editar {editingItem.type === 'evento' ? 'Evento' : 'Pista'}
            </h3>
            
            {editingItem.type === 'evento' ? (
              <>
                <FormGroup style={{ marginBottom: '16px' }}>
                  <Label>Nome</Label>
                  <Input value={editForm.nome} onChange={(e) => setEditForm(prev => ({ ...prev, nome: e.target.value }))} />
                </FormGroup>
                <FormGroup style={{ marginBottom: '16px' }}>
                  <Label>Descrição</Label>
                  <Input value={editForm.info} onChange={(e) => setEditForm(prev => ({ ...prev, info: e.target.value }))} />
                </FormGroup>
                <FormGroup style={{ marginBottom: '16px' }}>
                  <Label>Data Início</Label>
                  <Input type="datetime-local" value={editForm.dataInicio} onChange={(e) => setEditForm(prev => ({ ...prev, dataInicio: e.target.value }))} />
                </FormGroup>
                <FormGroup style={{ marginBottom: '16px' }}>
                  <Label>Data Fim</Label>
                  <Input type="datetime-local" value={editForm.dataFim} onChange={(e) => setEditForm(prev => ({ ...prev, dataFim: e.target.value }))} />
                </FormGroup>
              </>
            ) : (
              <>
                <FormGroup style={{ marginBottom: '16px' }}>
                  <Label>Nome</Label>
                  <Input value={editForm.nome} onChange={(e) => setEditForm(prev => ({ ...prev, nome: e.target.value }))} />
                </FormGroup>
                <FormGroup style={{ marginBottom: '16px' }}>
                  <Label>Descrição</Label>
                  <Input value={editForm.descricao} onChange={(e) => setEditForm(prev => ({ ...prev, descricao: e.target.value }))} />
                </FormGroup>
                <FormGroup style={{ marginBottom: '16px' }}>
                  <Label>CEP</Label>
                  <Input value={editForm.cep} onChange={(e) => setEditForm(prev => ({ ...prev, cep: e.target.value }))} />
                </FormGroup>
                <FormGroup style={{ marginBottom: '16px' }}>
                  <Label>Número</Label>
                  <Input value={editForm.numero} onChange={(e) => setEditForm(prev => ({ ...prev, numero: e.target.value }))} />
                </FormGroup>
              </>
            )}
            
            <ButtonGroup>
              <Button onClick={() => setEditingItem(null)}>Cancelar</Button>
              <Button primary onClick={handleSaveEdit}>Salvar</Button>
            </ButtonGroup>
          </div>
        </div>
      )}
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: '', item: null })}
        onConfirm={handleConfirmDelete}
        title={`Excluir ${confirmModal.type === 'evento' ? 'Evento' : 'Pista'}`}
        message={`Tem certeza que deseja excluir ${confirmModal.type === 'evento' ? 'o evento' : 'a pista'} "${confirmModal.item?.nome}"? Esta ação não pode ser desfeita.`}
      />
    </Container>
  );
};

export default Perfil;