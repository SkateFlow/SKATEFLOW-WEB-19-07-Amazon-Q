import React from 'react';
import styled from 'styled-components';
import SidebarAdmin from '../../../components/SidebarAdmin';

const AdminContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const ContentContainer = styled.div`
  margin-left: 250px;
  padding: 20px;
  background-color: #fff;
  color: #333;
`;

const Dashboard = () => {
  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <h1>Dashboard</h1>
        <p>Aqui você pode gerenciar eventos, artigos, usuários e outras funcionalidades.</p>
      </ContentContainer>
    </AdminContainer>
  );
};

export default Dashboard;