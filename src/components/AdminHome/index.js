import React from 'react';
import Header from '../../components/Header';
import styled from 'styled-components';
import SidebarAdmin from '../SidebarAdmin';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;
//macco
const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #fff;
  color: #333;
`;

const AdminHome = () => {
  return (
    <AdminContainer>
        <SidebarAdmin />
      <ContentContainer>
        <Header title="Admin Home" goto="/adminhome" />
        <h1>Home</h1>
        <p>Aqui você pode gerenciar eventos, artigos, usuários e outras funcionalidades.</p>
      </ContentContainer>
    </AdminContainer>
  );
};

export default AdminHome;
