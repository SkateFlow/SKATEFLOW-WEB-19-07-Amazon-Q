import React from 'react';
import styled from 'styled-components';
import { FiCalendar, FiMapPin, FiUsers, FiTrendingUp } from 'react-icons/fi';
import SidebarAdmin from '../../../components/SidebarAdmin';

const AdminContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  margin-left: 250px;
  padding: 40px;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #1a237e;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 18px;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.bgColor || 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.color || '#667eea'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1a237e;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const WelcomeSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`;

const WelcomeTitle = styled.h2`
  color: #1a237e;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const WelcomeText = styled.p`
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
`;

const Dashboard = () => {
  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Visão geral da plataforma SkateFlow</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard color="linear-gradient(90deg, #667eea 0%, #764ba2 100%)">
            <StatHeader>
              <div>
                <StatValue>2</StatValue>
                <StatLabel>Eventos Ativos</StatLabel>
              </div>
              <StatIcon bgColor="rgba(102, 126, 234, 0.1)" color="#667eea">
                <FiCalendar />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(90deg, #10b981 0%, #059669 100%)">
            <StatHeader>
              <div>
                <StatValue>2</StatValue>
                <StatLabel>Pistas Ativas</StatLabel>
              </div>
              <StatIcon bgColor="rgba(16, 185, 129, 0.1)" color="#10b981">
                <FiMapPin />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(90deg, #f59e0b 0%, #d97706 100%)">
            <StatHeader>
              <div>
                <StatValue>2</StatValue>
                <StatLabel>Usuários Cadastrados</StatLabel>
              </div>
              <StatIcon bgColor="rgba(245, 158, 11, 0.1)" color="#f59e0b">
                <FiUsers />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)">
            <StatHeader>
              <div>
                <StatValue>100%</StatValue>
                <StatLabel>Sistema Online</StatLabel>
              </div>
              <StatIcon bgColor="rgba(139, 92, 246, 0.1)" color="#8b5cf6">
                <FiTrendingUp />
              </StatIcon>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        <WelcomeSection>
          <WelcomeTitle>Bem-vindo ao Painel Administrativo</WelcomeTitle>
          <WelcomeText>
            Aqui você pode gerenciar todos os aspectos da plataforma SkateFlow. 
            Use o menu lateral para navegar entre as diferentes seções: eventos, pistas, usuários e muito mais. 
            Mantenha a comunidade de skate sempre atualizada com conteúdo relevante e de qualidade.
          </WelcomeText>
        </WelcomeSection>
      </ContentContainer>
    </AdminContainer>
  );
};

export default Dashboard;