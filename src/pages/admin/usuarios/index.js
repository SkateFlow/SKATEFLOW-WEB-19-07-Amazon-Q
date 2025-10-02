import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import SidebarAdmin from '../../../components/SidebarAdmin';
import SearchBar from '../../../components/SearchBar';
import EditUserModal from '../../../components/EditUserModal';
import ConfirmModal from '../../../components/ConfirmModal';

const AdminContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: relative;

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
    width: 250px;
  }
  
  &:nth-child(4) {
    width: 120px;
    text-align: center;
  }
  
  &:nth-child(5) {
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
    width: 250px;
    text-align: left;
  }
  
  &:nth-child(4) {
    width: 120px;
    text-align: center;
  }
  
  &:nth-child(5) {
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

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@skateflow.com',
      isAdmin: true,
      foto: null,
      isActive: true
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@skateflow.com',
      isAdmin: false,
      foto: null,
      isActive: true
    }
  ]);

  const getAvatarColor = (name) => {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#ffecd2', '#a8edea', '#d299c2'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const renderAvatar = (user) => {
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
  };

  const handleDelete = (userId) => {
    const user = users.find(u => u.id === userId);
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(user => user.id !== userToDelete.id));
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

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

        {filteredUsers.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyText>{searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}</EmptyText>
            <EmptySubtext>{searchTerm ? 'Tente pesquisar com outros termos' : 'Os usuários adicionados aparecerão aqui'}</EmptySubtext>
          </EmptyState>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Foto</TableHeader>
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Administrador</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {renderAvatar(user)}
                    </TableCell>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <AdminBadge isAdmin={user.isAdmin}>
                        {user.isAdmin ? 'Admin' : 'Usuário'}
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
                        <DeleteButton onClick={() => handleDelete(user.id)}>
                          <FiTrash2 size={16} />
                          Excluir
                        </DeleteButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
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