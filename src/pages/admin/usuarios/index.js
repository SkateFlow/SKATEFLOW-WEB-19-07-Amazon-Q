import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import SidebarAdmin from '../../../components/SidebarAdmin';
import SearchBar from '../../../components/SearchBar';
import EditUserModal from '../../../components/EditUserModal';
import ConfirmModal from '../../../components/ConfirmModal';
import { usuarioService } from '../../../services/usuarioService';
import { organizadorService } from '../../../services/organizadorService';

const AdminContainer = styled.div`
  background: 
    radial-gradient(circle at 20% 80%, #d0e6ffff 0%, transparent 25%),
    radial-gradient(circle at 80% 20%, #c4e0ffff 0%, transparent 25%),
    radial-gradient(circle at 40% 40%, #ffffff 0%, transparent 25%),
    #f8fafc;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  margin-left: 250px;
  padding: 40px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 30px;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #1a237e;
  color: white;
  
  &:hover {
    background: #303f9f;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: relative;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 20px;
  text-align: left;
  font-weight: 600;
  color: #1a237e;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  vertical-align: middle;
  
  &:first-child {
    width: 80px;
    text-align: center;
  }
  
  &:nth-child(2) {
    width: 200px;
  }
  
  &:nth-child(3) {
    width: 220px;
  }
  
  &:nth-child(4) {
    width: 120px;
    text-align: center;
  }
  
  &:nth-child(5) {
    width: 120px;
    text-align: center;
  }
  
  &:nth-child(6) {
    width: 100px;
    text-align: center;
  }
  
  &:last-child {
    width: 180px;
    text-align: center;
  }
`;

const TableRow = styled.tr`
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
  font-size: 14px;
  vertical-align: middle;
  
  &:first-child {
    text-align: center;
    width: 80px;
  }
  
  &:nth-child(2) {
    width: 200px;
    text-align: left;
  }
  
  &:nth-child(3) {
    width: 220px;
    text-align: left;
  }
  
  &:nth-child(4) {
    width: 120px;
    text-align: center;
  }
  
  &:nth-child(5) {
    width: 120px;
    text-align: center;
  }
  
  &:nth-child(6) {
    text-align: center;
    width: 100px;
  }
  
  &:last-child {
    text-align: center;
    width: 180px;
    border-bottom: none;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: white;
  background: ${props => props.bgColor};
  flex-shrink: 0;
  margin: 0 auto;
`;

const AvatarImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin: 0 auto;
  display: block;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.active ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.active ? '#166534' : '#dc2626'};
  display: inline-block;
`;

const AdminBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.isAdmin ? '#e0f2fe' : '#f1f5f9'};
  color: ${props => props.isAdmin ? '#0277bd' : '#64748b'};
  display: inline-block;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #e0f2fe;
  color: #0277bd;
  
  &:hover {
    background: #b3e5fc;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fee2e2;
  color: #dc2626;
  
  &:hover {
    background: #fecaca;
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

const EmptyText = styled.p`
  font-size: 18px;
  margin-bottom: 8px;
  color: #475569;
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  margin: 0;
`;

const ErrorNotification = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #dc2626;
  
  .error-icon {
    font-size: 20px;
  }
  
  .error-content {
    flex: 1;
  }
  
  .error-title {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .error-message {
    font-size: 14px;
    margin: 0;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    font-size: 18px;
    padding: 4px;
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 20px 0;
`;

const RefreshContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  background: ${props => props.active ? '#1a237e' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;

  &:hover {
    background: ${props => props.active ? '#1a237e' : '#f1f5f9'};
    border-color: ${props => props.active ? '#1a237e' : '#cbd5e0'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.span`
  color: #64748b;
  font-size: 14px;
  margin: 0 16px;
`;

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const [usuariosData, organizadoresData] = await Promise.all([
        usuarioService.listar(),
        organizadorService.listar().catch(() => [])
      ]);
      
      const organizadoresIds = organizadoresData.map(org => org.usuario_id?.id).filter(Boolean);
      
      const usuariosFormatados = usuariosData.map(usuario => ({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        nivelAcesso: usuario.nivelAcesso,
        isAdmin: usuario.nivelAcesso === 'ADMIN',
        isGerente: usuario.nivelAcesso === 'GERENTE',
        isOrganizador: organizadoresIds.includes(usuario.id),
        foto: null, // Carregar sob demanda
        isActive: usuario.statusUsuario === 'ATIVO',
        dataCadastro: usuario.dataCadastro
      }));
      // Ordenar por data de cadastro (mais recente primeiro)
      usuariosFormatados.sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro));
      setUsers(usuariosFormatados);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const carregarFotoUsuario = async (userId) => {
    try {
      const foto = await usuarioService.buscarFoto(userId);
      if (foto) {
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, foto: `data:image/jpeg;base64,${foto}` }
            : user
        ));
      }
    } catch (error) {
      // Ignora erro de foto
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const getAvatarColor = (name) => {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#ffecd2', '#a8edea', '#d299c2'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const renderAvatar = (user) => {
    // Carregar foto sob demanda quando o avatar for renderizado
    if (!user.foto && !user.fotoCarregada) {
      carregarFotoUsuario(user.id);
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, fotoCarregada: true } : u
      ));
    }
    
    if (user.foto) {
      return <AvatarImage src={user.foto} alt={user.nome} />;
    }
    return (
      <Avatar bgColor={getAvatarColor(user.nome)}>
        {user.nome.charAt(0).toUpperCase()}
      </Avatar>
    );
  };

  const handleEdit = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    // Recarrega a lista para garantir sincronização com o backend
    setTimeout(() => {
      carregarUsuarios();
    }, 500);
  };

  const handleDelete = (userId) => {
    const user = users.find(u => u.id === userId);
    
    // Bloquear exclusão de contas GERENTE
    if (user.isGerente) {
      setError('Contas de GERENTE não podem ser excluídas!');
      return;
    }
    
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete?.id) {
      setError('Usuário não selecionado');
      setShowConfirmModal(false);
      return;
    }

    try {
      console.log('Tentando excluir usuário:', userToDelete.id);
      await usuarioService.deletar(userToDelete.id);
      console.log('Usuário excluído com sucesso');
      
      // Remove o usuário da lista
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      setError(null);
      
      // Dispara evento para validar usuários logados
      window.dispatchEvent(new CustomEvent('userDeleted', { 
        detail: { deletedUserId: userToDelete.id } 
      }));
      
      // Recarrega a lista para garantir sincronização
      setTimeout(() => {
        carregarUsuarios();
      }, 500);
      
    } catch (err) {
      console.error('Erro completo:', err);
      const errorMessage = typeof err === 'string' ? err : 
                          err.response?.data?.message || 
                          err.message || 
                          'Erro ao excluir usuário';
      setError(errorMessage);
    } finally {
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };



  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <Header>
          <Title>Gerenciar Usuários</Title>
          <Subtitle>Gerencie todos os usuários da plataforma</Subtitle>
        </Header>

        <SearchContainer>
          <SearchBar
            placeholder="Pesquisar usuários por nome ou email..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </SearchContainer>

        {error && (
          <ErrorNotification>
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <div className="error-title">Erro na operação</div>
              <div className="error-message">{error}</div>
            </div>
            <button className="close-button" onClick={() => setError(null)}>×</button>
          </ErrorNotification>
        )}

        <RefreshContainer>
          <RefreshButton onClick={carregarUsuarios} disabled={loading}>
            <FiRefreshCw size={16} />
            Atualizar
          </RefreshButton>
        </RefreshContainer>

        {loading ? (
          <EmptyState>
            <EmptyIcon>⏳</EmptyIcon>
            <EmptyText>Carregando usuários...</EmptyText>
          </EmptyState>
        ) : error ? (
          <EmptyState>
            <EmptyIcon>⚠️</EmptyIcon>
            <EmptyText>Erro ao carregar usuários</EmptyText>
            <EmptySubtext>{error}</EmptySubtext>
          </EmptyState>
        ) : currentUsers.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyText>{searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}</EmptyText>
            <EmptySubtext>{searchTerm ? 'Tente pesquisar com outros termos' : 'Os usuários adicionados aparecerão aqui'}</EmptySubtext>
          </EmptyState>
        ) : (
          <>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Foto</TableHeader>
                    <TableHeader>Nome</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Data Cadastro</TableHeader>
                    <TableHeader>Nível de Acesso</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Ações</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {renderAvatar(user)}
                      </TableCell>
                      <TableCell>{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString('pt-BR') : '-'}
                      </TableCell>
                      <TableCell>
                        <AdminBadge isAdmin={user.isAdmin || user.isGerente}>
                          {user.isGerente ? 'Gerente' : user.isAdmin ? 'Admin' : user.isOrganizador ? 'Organizador' : 'Usuário'}
                        </AdminBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge active={user.isActive}>
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          <EditButton onClick={() => handleEdit(user.id)}>
                            <FiEdit size={16} />
                            Editar
                          </EditButton>
                          <DeleteButton 
                            onClick={() => handleDelete(user.id)}
                            disabled={user.isGerente}
                            style={{
                              opacity: user.isGerente ? 0.5 : 1,
                              cursor: user.isGerente ? 'not-allowed' : 'pointer',
                              background: user.isGerente ? '#f1f5f9' : '#fee2e2',
                              color: user.isGerente ? '#94a3b8' : '#dc2626'
                            }}
                          >
                            <FiTrash2 size={16} />
                            {user.isGerente ? 'Protegido' : 'Excluir'}
                          </DeleteButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
            
            {filteredUsers.length > 7 && (
              <PaginationContainer>
                <PaginationButton 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹ Anterior
                </PaginationButton>
                
                <PaginationInfo>
                  Página {currentPage} de {totalPages}
                </PaginationInfo>
                
                <PaginationButton 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próximo ›
                </PaginationButton>
              </PaginationContainer>
            )}
          </>
        )}
        
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={selectedUser}
          onSave={handleSaveUser}
        />
        
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Excluir usuário?"
          message={`Tem certeza que deseja excluir o usuário "${userToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        />
      </ContentContainer>
    </AdminContainer>
  );
};

export default Usuarios;