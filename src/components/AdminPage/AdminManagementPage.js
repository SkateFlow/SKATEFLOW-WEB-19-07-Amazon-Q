import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAdmins, deleteAdmin } from '../../services/adminService';
import SidebarAdmin from '../SidebarAdmin';

const AdminContainer = styled.div`
  display: flex;
  background-color: white;
  color: black;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 50px;
  padding-left: 300px;
  flex-grow: 1;
  text-align: center;
`;

const AdminList = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledTh = styled.th`
  padding: 15px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const StyledTd = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  background-color: ${({ index }) => (index % 2 === 0 ? '#f3f3f3' : '#ffffff')};

  &:hover {
    background-color: #e0f7fa;
  }
`;

const ActionButton = styled.button`
  margin: 0 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &.delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const data = await getAdmins();
    setAdmins(data);
  };

  const handleDelete = async (adminId) => {
    await deleteAdmin(adminId);
    fetchAdmins();
  };

  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <AdminList>
          <StyledTable>
            <thead>
              <tr>
                <StyledTh>Email</StyledTh>
                <StyledTh>Senha</StyledTh>
                <StyledTh>Ações</StyledTh>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr key={admin.id}>
                  <StyledTd index={index}>{admin.emailAdmin}</StyledTd>
                  <StyledTd index={index}>{admin.roleAdmin}</StyledTd>
                  <StyledTd index={index}>
                    <ActionButton onClick={() => handleDelete(admin.id)} className="delete">
                      Excluir
                    </ActionButton>
                  </StyledTd>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </AdminList>
      </ContentContainer>
    </AdminContainer>
  );
};

export default AdminManagementPage;
