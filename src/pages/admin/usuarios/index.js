import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FiEdit } from 'react-icons/fi';
import SidebarAdmin from '../../../components/SidebarAdmin';
import SearchBar from '../../../components/SearchBar';

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
  
  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  cursor: pointer;
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
  const [users, setUsers] = useState([
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@skateflow.com',
      senha: '••••••••',
      isAdmin: true
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@skateflow.com',
      senha: '••••••••',
      isAdmin: false
    }
  ]);

  const handleEdit = (userId) => {
    console.log('Editar usuário:', userId);
  };

  const toggleAdmin = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isAdmin: !user.isAdmin }
        : user
    ));
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
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Senha</TableHeader>
                  <TableHeader>Admin</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.senha}</TableCell>
                    <TableCell>
                      <Checkbox 
                        type="checkbox" 
                        checked={user.isAdmin}
                        onChange={() => toggleAdmin(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <EditButton onClick={() => handleEdit(user.id)}>
                        <FiEdit size={16} />
                        Editar
                      </EditButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </ContentContainer>
    </AdminContainer>
  );
};

export default Usuarios;